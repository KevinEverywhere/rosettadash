import type { ExportIR } from '@rosettadash/core';
import {
  generateScopeModuleSource,
  hasQueryScope,
  resolveExportQueryScope,
  scopedMongoListDocumentsLines,
} from '@rosettadash/core';
import type { CollectionResource, GeneratedFile, MongoExportOptions } from './types';
import { MongoExportError } from './types';
import {
  generateEnvExample,
  joinLines,
  resolveCollectionResources,
  resolveMongoSources,
  resolvePrimaryConnectionEnvKey,
} from './utils';

export function generateMongoInfraFiles(
  ir: ExportIR,
  options: MongoExportOptions = {},
): GeneratedFile[] {
  if (ir.targets.database !== 'mongodb') {
    throw new MongoExportError(
      `MongoDB exporter cannot generate database target "${ir.targets.database ?? 'undefined'}"`,
    );
  }

  const mongoSources = resolveMongoSources(ir);
  if (mongoSources.length === 0) {
    throw new MongoExportError('MongoDB export requires at least one MongoDB data source');
  }

  const root = options.rootDir ?? 'database/src';
  const connectionEnvKey = resolvePrimaryConnectionEnvKey(ir);
  const collectionResources = resolveCollectionResources(ir);
  const queryScope = resolveExportQueryScope(ir.domain, ir.meta.generatedAt);
  const includeScopedQueries = hasQueryScope(queryScope);

  const files: GeneratedFile[] = [
    {
      path: '.env.example',
      content: generateEnvExample(ir, queryScope),
      encoding: 'utf-8',
      description: 'Environment variable template for exported MongoDB layer',
    },
    {
      path: `${root}/mongo.client.ts`,
      content: generateClientModule(connectionEnvKey),
      encoding: 'utf-8',
      description: 'MongoDB client helper',
    },
    {
      path: `${root}/queries/list-documents.ts`,
      content: generateListDocumentsHelper(includeScopedQueries),
      encoding: 'utf-8',
      description: 'Shared list-documents query helper',
    },
    {
      path: 'README.export.database.md',
      content: generateReadme(ir, connectionEnvKey),
      encoding: 'utf-8',
      description: 'Setup notes for exported MongoDB database fragment',
    },
  ];

  const resources =
    collectionResources.length > 0
      ? collectionResources
      : [
          {
            routeId: 'fallback:list-records',
            resourceName: 'records',
            collectionName: mongoSources[0]?.collection ?? 'records',
            method: 'GET' as const,
          },
        ];

  for (const resource of resources) {
    files.push({
      path: `${root}/collections/${resource.resourceName}.ts`,
      content: generateCollectionModule(resource),
      encoding: 'utf-8',
      description: `List query for collection ${resource.collectionName}`,
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

function generateClientModule(connectionEnvKey: string): string {
  return joinLines([
    `import { MongoClient } from 'mongodb';`,
    ``,
    `let client: MongoClient | undefined;`,
    ``,
    `export async function getMongoClient(): Promise<MongoClient> {`,
    `  if (client) {`,
    `    return client;`,
    `  }`,
    `  const uri = process.env['${connectionEnvKey}'];`,
    `  if (!uri) {`,
    `    throw new Error('Missing required environment variable: ${connectionEnvKey}');`,
    `  }`,
    `  client = new MongoClient(uri);`,
    `  await client.connect();`,
    `  return client;`,
    `}`,
    ``,
    `export async function closeMongoClient(): Promise<void> {`,
    `  if (client) {`,
    `    await client.close();`,
    `    client = undefined;`,
    `  }`,
    `}`,
    ``,
  ]);
}

function generateListDocumentsHelper(scoped: boolean): string {
  const scopeImport = scoped ? [`import { resolveRuntimeScope } from '../domain/scope';`, ``] : [];
  const body = scoped
    ? scopedMongoListDocumentsLines({ indent: '  ' })
    : [
        `  const db = client.db();`,
        `  const cursor = db.collection(collectionName).find({}).limit(limit);`,
        `  return cursor.toArray();`,
      ];

  return joinLines([
    `import type { MongoClient } from 'mongodb';`,
    ...scopeImport,
    `export async function listDocuments(`,
    `  client: MongoClient,`,
    `  collectionName: string,`,
    `  limit = 100,`,
    `): Promise<Record<string, unknown>[]> {`,
    `  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(collectionName)) {`,
    `    throw new Error(\`Unsafe MongoDB collection identifier: \${collectionName}\`);`,
    `  }`,
    ...body,
    `}`,
    ``,
  ]);
}

function generateCollectionModule(resource: CollectionResource): string {
  return joinLines([
    `import { getMongoClient } from '../mongo.client';`,
    `import { listDocuments } from '../queries/list-documents';`,
    ``,
    `export async function list${capitalize(resource.resourceName)}Documents(): Promise<`,
    `  Record<string, unknown>[]`,
    `> {`,
    `  const client = await getMongoClient();`,
    `  return listDocuments(client, '${resource.collectionName}');`,
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
      ? ir.routes.map((route) => `- \`${route.method} ${route.path}\` → collection query module`)
      : [`- \`GET /api/records\` (fallback when IR routes are empty)`];

  return joinLines([
    `# ${ir.meta.compositeName} — MongoDB Database Export`,
    ``,
    `Generated at ${ir.meta.generatedAt} from composite \`${ir.meta.compositeId}\` v${ir.meta.version}.`,
    ``,
    `## Files`,
    ``,
    `- \`database/src/mongo.client.ts\` — MongoDB client using \`${connectionEnvKey}\``,
    `- \`database/src/queries/list-documents.ts\` — shared find helper`,
    `- \`database/src/collections/*.ts\` — collection list functions derived from ExportIR routes`,
    `- \`.env.example\` — required environment variables`,
    ``,
    `## Routes / collections`,
    ``,
    ...routes,
    ``,
    `## Setup`,
    ``,
    `1. Copy the generated \`database/\` folder into your app.`,
    `2. Install dependencies: \`npm install mongodb\`.`,
    `3. Copy \`.env.example\` to \`.env\` and set \`${connectionEnvKey}\`.`,
    `4. Wire collection modules into your server routes (Nest, Express, Next, or Nuxt).`,
    ``,
  ]);
}
