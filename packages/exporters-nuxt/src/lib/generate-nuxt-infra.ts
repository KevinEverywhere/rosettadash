import type { ExportIR } from '@rosettadash/core';
import {
  generateScopeModuleSource,
  hasQueryScope,
  resolveExportQueryScope,
  scopedPostgresListRowsLines,
} from '@rosettadash/core';
import type { GeneratedFile, NuxtExportOptions, RouteResource } from './types';
import { NuxtExportError } from './types';
import {
  generateEnvExample,
  joinLines,
  resolveGlobalPrefix,
  resolvePostgresSources,
  resolvePrimaryConnectionEnvKey,
  resolveRouteResources,
  routeImportPath,
  routeServerPath,
} from './utils';

export function generateNuxtInfraFiles(
  ir: ExportIR,
  options: NuxtExportOptions = {},
): GeneratedFile[] {
  if (ir.targets.server !== 'nuxt') {
    throw new NuxtExportError(`Nuxt exporter cannot generate server target "${ir.targets.server}"`);
  }

  const postgresSources = resolvePostgresSources(ir);
  if (postgresSources.length === 0) {
    throw new NuxtExportError('Nuxt infra export requires at least one PostgreSQL data source');
  }

  const root = options.rootDir ?? 'server';
  const globalPrefix = resolveGlobalPrefix(ir);
  const routeResources = resolveRouteResources(ir);
  const connectionEnvKey = resolvePrimaryConnectionEnvKey(ir);
  const queryScope = resolveExportQueryScope(ir.domain, ir.meta.generatedAt);
  const includeScopedQueries = hasQueryScope(queryScope);

  const files: GeneratedFile[] = [
    {
      path: '.env.example',
      content: generateEnvExample(ir, queryScope),
      encoding: 'utf-8',
      description: 'Environment variable template for exported Nuxt server',
    },
    {
      path: `${root}/utils/database.ts`,
      content: generateDatabaseModule(connectionEnvKey, includeScopedQueries),
      encoding: 'utf-8',
      description: 'PostgreSQL pool helper',
    },
    {
      path: 'README.export.server.md',
      content: generateReadme(ir, globalPrefix, connectionEnvKey),
      encoding: 'utf-8',
      description: 'Setup notes for exported Nuxt server fragment',
    },
  ];

  const resources =
    routeResources.length > 0
      ? routeResources
      : [
          {
            routeId: 'fallback:list-records',
            resourceName: 'records',
            tableName: postgresSources[0]?.table ?? 'records',
            method: 'GET' as const,
            globalPrefix,
          },
        ];

  for (const resource of resources) {
    files.push({
      path: routeServerPath(globalPrefix, resource.resourceName),
      content: generateRouteHandler(resource),
      encoding: 'utf-8',
      description: `Route handler for ${resource.method} /${globalPrefix}/${resource.resourceName}`,
    });
  }

  if (includeScopedQueries && queryScope) {
    files.push({
      path: `${root}/utils/scope.ts`,
      content: generateScopeModuleSource(queryScope),
      encoding: 'utf-8',
      description: 'Default domain query scope from ExportIR',
    });
  }

  return files;
}

function generateDatabaseModule(connectionEnvKey: string, scoped: boolean): string {
  const scopeImport = scoped ? [`import { resolveRuntimeScope } from './scope';`, ``] : [];
  const queryRowsBody = scoped
    ? [
        `  const client = getPool();`,
        ...scopedPostgresListRowsLines({ queryReceiver: 'client', indent: '  ' }),
      ]
    : [
        `  const client = getPool();`,
        `  const result = await client.query(`,
        `    \`SELECT * FROM \${quoteIdentifier(tableName)} ORDER BY 1 LIMIT $1\`,`,
        `    [limit],`,
        `  );`,
        `  return result.rows;`,
      ];

  return joinLines([
    `import { Pool } from 'pg';`,
    ...scopeImport,
    ``,
    `let pool: Pool | undefined;`,
    ``,
    `export function getPool(): Pool {`,
    `  if (pool) {`,
    `    return pool;`,
    `  }`,
    `  const connectionString = process.env['${connectionEnvKey}'];`,
    `  if (!connectionString) {`,
    `    throw new Error('Missing required environment variable: ${connectionEnvKey}');`,
    `  }`,
    `  pool = new Pool({ connectionString });`,
    `  return pool;`,
    `}`,
    ``,
    `export async function queryRows(`,
    `  tableName: string,`,
    `  limit = 100,`,
    `): Promise<Record<string, unknown>[]> {`,
    ...queryRowsBody,
    `}`,
    ``,
    `function quoteIdentifier(value: string): string {`,
    `  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {`,
    `    throw new Error(\`Unsafe SQL identifier: \${value}\`);`,
    `  }`,
    `  return \`"\${value.replace(/"/g, '""')}"\`;`,
    `}`,
    ``,
  ]);
}

function generateRouteHandler(resource: RouteResource): string {
  const importPath = routeImportPath(resource.globalPrefix);

  return joinLines([
    `import { queryRows } from '${importPath}';`,
    ``,
    `export default defineEventHandler(async () => {`,
    `  try {`,
    `    return await queryRows('${resource.tableName}');`,
    `  } catch (error) {`,
    `    throw createError({`,
    `      statusCode: 500,`,
    `      statusMessage: error instanceof Error ? error.message : 'Unknown error',`,
    `    });`,
    `  }`,
    `});`,
    ``,
  ]);
}

function generateReadme(ir: ExportIR, globalPrefix: string, connectionEnvKey: string): string {
  const routes =
    ir.routes.length > 0
      ? ir.routes.map((route) => `- \`${route.method} ${route.path}\``)
      : [`- \`GET /${globalPrefix}/records\` (fallback when IR routes are empty)`];

  return joinLines([
    `# ${ir.meta.compositeName} — Nuxt Server Export`,
    ``,
    `Generated at ${ir.meta.generatedAt} from composite \`${ir.meta.compositeId}\` v${ir.meta.version}.`,
    ``,
    `## Files`,
    ``,
    `- \`server/api/*.get.ts\` or \`server/routes/*/*.get.ts\` — Nitro route handlers`,
    `- \`server/utils/database.ts\` — PostgreSQL pool helper using \`${connectionEnvKey}\``,
    `- \`.env.example\` — required environment variables`,
    ``,
    `## Routes`,
    ``,
    ...routes,
    ``,
    `## Setup`,
    ``,
    `1. Copy the generated \`server/\` tree into your Nuxt 3 project.`,
    `2. Install dependencies: \`npm install nuxt pg\`.`,
    `3. Copy \`.env.example\` to \`.env\` and set \`${connectionEnvKey}\`.`,
    `4. Ensure the referenced PostgreSQL tables exist.`,
    `5. Run \`npm run dev\` and verify routes respond with row data.`,
    ``,
  ]);
}
