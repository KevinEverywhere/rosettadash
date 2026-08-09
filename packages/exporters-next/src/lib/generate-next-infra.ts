import type { ExportIR } from '@dashbuilder/core';
import type { GeneratedFile, NextExportOptions, RouteResource } from './types';
import { NextExportError } from './types';
import {
  generateEnvExample,
  joinLines,
  resolveGlobalPrefix,
  resolvePostgresSources,
  resolvePrimaryConnectionEnvKey,
  resolveRouteResources,
  routeAppPath,
  routeImportPath,
} from './utils';

export function generateNextInfraFiles(
  ir: ExportIR,
  options: NextExportOptions = {},
): GeneratedFile[] {
  if (ir.targets.server !== 'next') {
    throw new NextExportError(`Next exporter cannot generate server target "${ir.targets.server}"`);
  }

  const postgresSources = resolvePostgresSources(ir);
  if (postgresSources.length === 0) {
    throw new NextExportError('Next infra export requires at least one PostgreSQL data source');
  }

  const root = options.rootDir ?? 'server/src';
  const globalPrefix = resolveGlobalPrefix(ir);
  const routeResources = resolveRouteResources(ir);
  const connectionEnvKey = resolvePrimaryConnectionEnvKey(ir);

  const files: GeneratedFile[] = [
    {
      path: '.env.example',
      content: generateEnvExample(ir),
      encoding: 'utf-8',
      description: 'Environment variable template for exported Next.js server',
    },
    {
      path: `${root}/lib/database/pool.ts`,
      content: generatePoolModule(connectionEnvKey),
      encoding: 'utf-8',
      description: 'PostgreSQL pool helper',
    },
    {
      path: 'README.export.server.md',
      content: generateReadme(ir, globalPrefix, connectionEnvKey),
      encoding: 'utf-8',
      description: 'Setup notes for exported Next.js server fragment',
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
      path: `${root}/${routeAppPath(globalPrefix, resource.resourceName)}/route.ts`,
      content: generateRouteHandler(resource),
      encoding: 'utf-8',
      description: `Route handler for ${resource.method} /${globalPrefix}/${resource.resourceName}`,
    });
  }

  return files;
}

function generatePoolModule(connectionEnvKey: string): string {
  return joinLines([
    `import { Pool } from 'pg';`,
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
    `  const client = getPool();`,
    `  const result = await client.query(`,
    `    \`SELECT * FROM \${quoteIdentifier(tableName)} ORDER BY 1 LIMIT $1\`,`,
    `    [limit],`,
    `  );`,
    `  return result.rows;`,
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
  const importPath = routeImportPath(resource.globalPrefix, resource.resourceName);

  return joinLines([
    `import { NextResponse } from 'next/server';`,
    `import { queryRows } from '${importPath}';`,
    ``,
    `export async function GET() {`,
    `  try {`,
    `    const rows = await queryRows('${resource.tableName}');`,
    `    return NextResponse.json(rows);`,
    `  } catch (error) {`,
    `    const message = error instanceof Error ? error.message : 'Unknown error';`,
    `    return NextResponse.json({ error: message }, { status: 500 });`,
    `  }`,
    `}`,
    ``,
  ]);
}

function generateReadme(ir: ExportIR, globalPrefix: string, connectionEnvKey: string): string {
  const routes =
    ir.routes.length > 0
      ? ir.routes.map((route) => `- \`${route.method} ${route.path}\``)
      : [`- \`GET /${globalPrefix}/records\` (fallback when IR routes are empty)`];

  return joinLines([
    `# ${ir.meta.compositeName} — Next.js Server Export`,
    ``,
    `Generated at ${ir.meta.generatedAt} from composite \`${ir.meta.compositeId}\` v${ir.meta.version}.`,
    ``,
    `## Files`,
    ``,
    `- \`server/src/app/${globalPrefix}/*/route.ts\` — App Router API route handlers`,
    `- \`server/src/lib/database/pool.ts\` — PostgreSQL pool helper using \`${connectionEnvKey}\``,
    `- \`.env.example\` — required environment variables`,
    ``,
    `## Routes`,
    ``,
    ...routes,
    ``,
    `## Setup`,
    ``,
    `1. Copy the generated \`server/src\` tree into your Next.js App Router project.`,
    `2. Install dependencies: \`npm install next react react-dom pg @types/pg\`.`,
    `3. Copy \`.env.example\` to \`.env.local\` and set \`${connectionEnvKey}\`.`,
    `4. Ensure the referenced PostgreSQL tables exist.`,
    `5. Run \`npm run dev\` and verify routes respond with row data.`,
    ``,
  ]);
}
