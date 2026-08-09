import type { ExportIR } from '@dashbuilder/core';
import type { ExpressExportOptions, GeneratedFile, RouteResource } from './types';
import { ExpressExportError } from './types';
import {
  generateEnvExample,
  joinLines,
  resolveGlobalPrefix,
  resolvePostgresSources,
  resolvePrimaryConnectionEnvKey,
  resolveRouteResources,
} from './utils';

export function generateExpressInfraFiles(
  ir: ExportIR,
  options: ExpressExportOptions = {},
): GeneratedFile[] {
  if (ir.targets.server !== 'express') {
    throw new ExpressExportError(
      `Express exporter cannot generate server target "${ir.targets.server}"`,
    );
  }

  const postgresSources = resolvePostgresSources(ir);
  if (postgresSources.length === 0) {
    throw new ExpressExportError('Express infra export requires at least one PostgreSQL data source');
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
      description: 'Environment variable template for exported Express server',
    },
    {
      path: `${root}/index.ts`,
      content: generateIndexTs(globalPrefix, routeResources, postgresSources),
      encoding: 'utf-8',
      description: 'Express bootstrap entry point',
    },
    {
      path: `${root}/database/pool.ts`,
      content: generatePoolModule(connectionEnvKey),
      encoding: 'utf-8',
      description: 'PostgreSQL pool helper',
    },
    {
      path: 'README.export.server.md',
      content: generateReadme(ir, globalPrefix, connectionEnvKey),
      encoding: 'utf-8',
      description: 'Setup notes for exported Express server fragment',
    },
  ];

  for (const resource of routeResources) {
    files.push({
      path: `${root}/routes/${resource.resourceName}.ts`,
      content: generateRouteModule(resource),
      encoding: 'utf-8',
      description: `Route handler for ${resource.method} /${globalPrefix}/${resource.resourceName}`,
    });
  }

  if (routeResources.length === 0) {
    const fallback: RouteResource = {
      routeId: 'fallback:list-records',
      resourceName: 'records',
      routerName: 'RecordsRouter',
      tableName: postgresSources[0]?.table ?? 'records',
      method: 'GET',
      globalPrefix,
    };
    files.push({
      path: `${root}/routes/records.ts`,
      content: generateRouteModule(fallback),
      encoding: 'utf-8',
      description: 'Fallback list route when ExportIR has no routes',
    });
  }

  return files;
}

function generateIndexTs(
  globalPrefix: string,
  routeResources: RouteResource[],
  postgresSources: { table?: string }[],
): string {
  const resources =
    routeResources.length > 0
      ? routeResources
      : [
          {
            resourceName: 'records',
            routerName: 'RecordsRouter',
            tableName: postgresSources[0]?.table ?? 'records',
          } as RouteResource,
        ];

  const imports = resources.map(
    (resource) =>
      `import { create${resource.routerName} } from './routes/${resource.resourceName}';`,
  );
  const mounts = resources.map(
    (resource) =>
      `  app.use('/${globalPrefix}/${resource.resourceName}', create${resource.routerName}(pool));`,
  );

  return joinLines([
    `import cors from 'cors';`,
    `import express from 'express';`,
    `import { createPool } from './database/pool';`,
    ...imports,
    ``,
    `const app = express();`,
    `app.use(cors());`,
    `app.use(express.json());`,
    ``,
    `const pool = createPool();`,
    ...mounts,
    ``,
    `const port = Number(process.env.PORT) || 3000;`,
    `app.listen(port, () => {`,
    `  console.log(\`Server running on http://localhost:\${port}/${globalPrefix}\`);`,
    `});`,
    ``,
  ]);
}

function generatePoolModule(connectionEnvKey: string): string {
  return joinLines([
    `import { Pool } from 'pg';`,
    ``,
    `let pool: Pool | undefined;`,
    ``,
    `export function createPool(): Pool {`,
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
    `  client: Pool,`,
    `  tableName: string,`,
    `  limit = 100,`,
    `): Promise<Record<string, unknown>[]> {`,
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

function generateRouteModule(resource: RouteResource): string {
  return joinLines([
    `import { Router } from 'express';`,
    `import type { Pool } from 'pg';`,
    `import { queryRows } from '../database/pool';`,
    ``,
    `export function create${resource.routerName}(pool: Pool): Router {`,
    `  const router = Router();`,
    ``,
    `  router.get('/', async (_req, res, next) => {`,
    `    try {`,
    `      const rows = await queryRows(pool, '${resource.tableName}');`,
    `      res.json(rows);`,
    `    } catch (error) {`,
    `      next(error);`,
    `    }`,
    `  });`,
    ``,
    `  return router;`,
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
    `# ${ir.meta.compositeName} — Express Server Export`,
    ``,
    `Generated at ${ir.meta.generatedAt} from composite \`${ir.meta.compositeId}\` v${ir.meta.version}.`,
    ``,
    `## Files`,
    ``,
    `- \`server/src/index.ts\` — Express bootstrap with \`/${globalPrefix}\` route prefix`,
    `- \`server/src/database/pool.ts\` — PostgreSQL pool helper using \`${connectionEnvKey}\``,
    `- \`server/src/routes/*.ts\` — list endpoints derived from ExportIR routes`,
    `- \`.env.example\` — required environment variables`,
    ``,
    `## Routes`,
    ``,
    ...routes,
    ``,
    `## Setup`,
    ``,
    `1. Copy the generated \`server/\` folder into your Express app (or use it as a starter).`,
    `2. Install dependencies: \`npm install express cors pg @types/express @types/cors @types/pg\`.`,
    `3. Copy \`.env.example\` to \`.env\` and set \`${connectionEnvKey}\`.`,
    `4. Ensure the referenced PostgreSQL tables exist.`,
    `5. Start the server and verify routes respond with row data.`,
    ``,
  ]);
}
