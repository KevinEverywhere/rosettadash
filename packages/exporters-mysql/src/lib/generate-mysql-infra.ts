import type { ExportIR } from '@rosettadash/core';
import {
  generateScopeModuleSource,
  hasQueryScope,
  resolveExportQueryScope,
  scopedMysqlListRowsLines,
} from '@rosettadash/core';
import type { GeneratedFile, MysqlExportOptions, TableResource } from './types';
import { MysqlExportError } from './types';
import {
  generateEnvExample,
  joinLines,
  resolveConnectionEnvKey,
  resolveMysqlSources,
  resolveTableResources,
} from './utils';

export function generateMysqlInfraFiles(
  ir: ExportIR,
  options: MysqlExportOptions = {},
): GeneratedFile[] {
  if (ir.targets.database !== 'mysql') {
    throw new MysqlExportError(
      `MySQL exporter cannot generate database target "${ir.targets.database ?? 'undefined'}"`,
    );
  }

  const mysqlSources = resolveMysqlSources(ir);
  if (mysqlSources.length === 0) {
    throw new MysqlExportError('MySQL export requires at least one MySQL data source');
  }

  const root = options.rootDir ?? 'database/src';
  const connectionEnvKey = resolveConnectionEnvKey(ir);
  const tableResources = resolveTableResources(ir);
  const queryScope = resolveExportQueryScope(ir.domain, ir.meta.generatedAt);
  const includeScopedQueries = hasQueryScope(queryScope);

  const files: GeneratedFile[] = [
    {
      path: '.env.example',
      content: generateEnvExample(ir, connectionEnvKey, queryScope),
      encoding: 'utf-8',
      description: 'Environment variable template for exported MySQL layer',
    },
    {
      path: `${root}/mysql.pool.ts`,
      content: generatePoolModule(connectionEnvKey),
      encoding: 'utf-8',
      description: 'mysql2 connection pool helper',
    },
    {
      path: `${root}/queries/list-rows.ts`,
      content: generateListRowsHelper(includeScopedQueries),
      encoding: 'utf-8',
      description: 'Shared list-rows query helper',
    },
    {
      path: 'README.export.database.md',
      content: generateReadme(ir, connectionEnvKey),
      encoding: 'utf-8',
      description: 'Setup notes for exported MySQL database fragment',
    },
  ];

  const resources =
    tableResources.length > 0
      ? tableResources
      : [
          {
            routeId: 'fallback:list-records',
            resourceName: 'records',
            tableName: mysqlSources[0]?.table ?? 'records',
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

function generatePoolModule(connectionEnvKey: string): string {
  return joinLines([
    `import { createPool, type Pool } from 'mysql2/promise';`,
    ``,
    `let pool: Pool | undefined;`,
    ``,
    `export function getMysqlPool(): Pool {`,
    `  if (pool) {`,
    `    return pool;`,
    `  }`,
    `  const url = process.env['${connectionEnvKey}'];`,
    `  if (!url) {`,
    `    throw new Error('Missing required environment variable: ${connectionEnvKey}');`,
    `  }`,
    `  pool = createPool(url);`,
    `  return pool;`,
    `}`,
    ``,
    `export async function closeMysqlPool(): Promise<void> {`,
    `  if (pool) {`,
    `    await pool.end();`,
    `    pool = undefined;`,
    `  }`,
    `}`,
    ``,
  ]);
}

function generateListRowsHelper(scoped: boolean): string {
  const scopeImport = scoped ? [`import { resolveRuntimeScope } from '../domain/scope';`, ``] : [];
  const body = scoped
    ? scopedMysqlListRowsLines({ indent: '  ' })
    : [
        `  const [rows] = await pool.query(`,
        `    \`SELECT * FROM \\\`\${tableName}\\\` LIMIT ?\`,`,
        `    [limit],`,
        `  );`,
        `  return rows as Record<string, unknown>[];`,
      ];

  return joinLines([
    `import type { Pool } from 'mysql2/promise';`,
    ...scopeImport,
    `export async function listRows(`,
    `  pool: Pool,`,
    `  tableName: string,`,
    `  limit = 100,`,
    `): Promise<Record<string, unknown>[]> {`,
    `  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {`,
    `    throw new Error(\`Unsafe MySQL table identifier: \${tableName}\`);`,
    `  }`,
    ...body,
    `}`,
    ``,
  ]);
}

function generateTableModule(resource: TableResource): string {
  return joinLines([
    `import { getMysqlPool } from '../mysql.pool';`,
    `import { listRows } from '../queries/list-rows';`,
    ``,
    `export async function list${capitalize(resource.resourceName)}Rows(): Promise<Record<string, unknown>[]> {`,
    `  const pool = getMysqlPool();`,
    `  return listRows(pool, '${resource.tableName}');`,
    `}`,
    ``,
  ]);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function generateReadme(ir: ExportIR, connectionEnvKey: string): string {
  const routes =
    ir.routes.length > 0
      ? ir.routes.map((route) => `- \`${route.method} ${route.path}\` → table query module`)
      : [`- \`GET /api/records\` (fallback when IR routes are empty)`];

  return joinLines([
    `# ${ir.meta.compositeName} — MySQL Database Export`,
    ``,
    `Generated at ${ir.meta.generatedAt} from composite \`${ir.meta.compositeId}\` v${ir.meta.version}.`,
    ``,
    `## Files`,
    ``,
    `- \`database/src/mysql.pool.ts\` — mysql2 pool using \`${connectionEnvKey}\``,
    `- \`database/src/queries/list-rows.ts\` — shared SELECT helper`,
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
    `2. Install dependencies: \`npm install mysql2\`.`,
    `3. Copy \`.env.example\` to \`.env\` and set \`${connectionEnvKey}\`.`,
    `4. Wire table modules into your server routes (Nest, Express, Next, or Nuxt).`,
    ``,
  ]);
}
