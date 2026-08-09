import type { ExportIR } from '@dashbuilder/core';
import {
  generateScopeModuleSource,
  hasQueryScope,
  resolveExportQueryScope,
  scopedSupabaseListRowsLines,
} from '@dashbuilder/core';
import type { GeneratedFile, SupabaseExportOptions, TableResource } from './types';
import { SupabaseExportError } from './types';
import {
  generateEnvExample,
  joinLines,
  resolveAnonKeyEnvKey,
  resolveSupabaseSources,
  resolveTableResources,
  resolveUrlEnvKey,
} from './utils';

export function generateSupabaseInfraFiles(
  ir: ExportIR,
  options: SupabaseExportOptions = {},
): GeneratedFile[] {
  if (ir.targets.database !== 'supabase') {
    throw new SupabaseExportError(
      `Supabase exporter cannot generate database target "${ir.targets.database ?? 'undefined'}"`,
    );
  }

  const supabaseSources = resolveSupabaseSources(ir);
  if (supabaseSources.length === 0) {
    throw new SupabaseExportError('Supabase export requires at least one Supabase data source');
  }

  const root = options.rootDir ?? 'database/src';
  const urlEnvKey = resolveUrlEnvKey(ir);
  const anonKeyEnvKey = resolveAnonKeyEnvKey(ir);
  const tableResources = resolveTableResources(ir);
  const queryScope = resolveExportQueryScope(ir.domain, ir.meta.generatedAt);
  const includeScopedQueries = hasQueryScope(queryScope);

  const files: GeneratedFile[] = [
    {
      path: '.env.example',
      content: generateEnvExample(ir, urlEnvKey, anonKeyEnvKey, queryScope),
      encoding: 'utf-8',
      description: 'Environment variable template for exported Supabase layer',
    },
    {
      path: `${root}/supabase.client.ts`,
      content: generateClientModule(urlEnvKey, anonKeyEnvKey),
      encoding: 'utf-8',
      description: 'Supabase JS client helper',
    },
    {
      path: `${root}/queries/list-rows.ts`,
      content: generateListRowsHelper(includeScopedQueries),
      encoding: 'utf-8',
      description: 'Shared list-rows query helper',
    },
    {
      path: 'README.export.database.md',
      content: generateReadme(ir, urlEnvKey, anonKeyEnvKey),
      encoding: 'utf-8',
      description: 'Setup notes for exported Supabase database fragment',
    },
  ];

  const resources =
    tableResources.length > 0
      ? tableResources
      : [
          {
            routeId: 'fallback:list-records',
            resourceName: 'records',
            tableName: supabaseSources[0]?.table ?? 'records',
            method: 'GET' as const,
          },
        ];

  for (const resource of resources) {
    files.push({
      path: `${root}/tables/${resource.resourceName}.ts`,
      content: generateTableModule(resource),
      encoding: 'utf-8',
      description: `List query for table ${resource.tableName}`,
    });
  }

  if (includeScopedQueries && queryScope) {
    files.push({
      path: `${root}/domain/scope.ts`,
      content: generateScopeModuleSource(queryScope),
      encoding: 'utf-8',
      description: 'Default domain query scope from ExportIR',
    });
  }

  return files;
}

function generateClientModule(urlEnvKey: string, anonKeyEnvKey: string): string {
  return joinLines([
    `import { createClient, type SupabaseClient } from '@supabase/supabase-js';`,
    ``,
    `let client: SupabaseClient | undefined;`,
    ``,
    `export function getSupabaseClient(): SupabaseClient {`,
    `  if (client) {`,
    `    return client;`,
    `  }`,
    `  const url = process.env['${urlEnvKey}'];`,
    `  const anonKey = process.env['${anonKeyEnvKey}'];`,
    `  if (!url) {`,
    `    throw new Error('Missing required environment variable: ${urlEnvKey}');`,
    `  }`,
    `  if (!anonKey) {`,
    `    throw new Error('Missing required environment variable: ${anonKeyEnvKey}');`,
    `  }`,
    `  client = createClient(url, anonKey);`,
    `  return client;`,
    `}`,
    ``,
  ]);
}

function generateListRowsHelper(scoped: boolean): string {
  const scopeImport = scoped ? [`import { resolveRuntimeScope } from '../domain/scope';`, ``] : [];
  const body = scoped
    ? scopedSupabaseListRowsLines({ indent: '  ' })
    : [
        `  const { data, error } = await client.from(tableName).select('*').limit(limit);`,
        `  if (error) {`,
        `    throw error;`,
        `  }`,
        `  return (data ?? []) as Record<string, unknown>[];`,
      ];

  return joinLines([
    `import type { SupabaseClient } from '@supabase/supabase-js';`,
    ...scopeImport,
    `export async function listRows(`,
    `  client: SupabaseClient,`,
    `  tableName: string,`,
    `  limit = 100,`,
    `): Promise<Record<string, unknown>[]> {`,
    `  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {`,
    `    throw new Error(\`Unsafe Supabase table identifier: \${tableName}\`);`,
    `  }`,
    ...body,
    `}`,
    ``,
  ]);
}

function generateTableModule(resource: TableResource): string {
  return joinLines([
    `import { getSupabaseClient } from '../supabase.client';`,
    `import { listRows } from '../queries/list-rows';`,
    ``,
    `export async function list${capitalize(resource.resourceName)}Rows(): Promise<Record<string, unknown>[]> {`,
    `  const client = getSupabaseClient();`,
    `  return listRows(client, '${resource.tableName}');`,
    `}`,
    ``,
  ]);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function generateReadme(ir: ExportIR, urlEnvKey: string, anonKeyEnvKey: string): string {
  const routes =
    ir.routes.length > 0
      ? ir.routes.map((route) => `- \`${route.method} ${route.path}\` → table query module`)
      : [`- \`GET /api/records\` (fallback when IR routes are empty)`];

  return joinLines([
    `# ${ir.meta.compositeName} — Supabase Database Export`,
    ``,
    `Generated at ${ir.meta.generatedAt} from composite \`${ir.meta.compositeId}\` v${ir.meta.version}.`,
    ``,
    `## Files`,
    ``,
    `- \`database/src/supabase.client.ts\` — client using \`${urlEnvKey}\` and \`${anonKeyEnvKey}\``,
    `- \`database/src/queries/list-rows.ts\` — shared select helper`,
    `- \`database/src/tables/*.ts\` — table list functions derived from ExportIR routes`,
    `- \`.env.example\` — required environment variables`,
    ``,
    `## Routes / tables`,
    ``,
    ...routes,
    ``,
    `## Setup`,
    ``,
    `1. Copy the generated \`database/\` folder into your app.`,
    `2. Install dependencies: \`npm install @supabase/supabase-js\`.`,
    `3. Copy \`.env.example\` to \`.env\` and set \`${urlEnvKey}\` and \`${anonKeyEnvKey}\`.`,
    `4. Ensure Row Level Security policies allow the queries your dashboard needs.`,
    `5. Wire table modules into your server routes (Nest, Express, Next, or Nuxt).`,
    ``,
  ]);
}
