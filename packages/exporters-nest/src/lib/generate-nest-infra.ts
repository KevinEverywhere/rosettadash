import type { ExportIR } from '@dashbuilder/core';
import type { GeneratedFile, NestExportOptions, RouteResource } from './types';
import { NestExportError } from './types';
import {
  generateEnvExample,
  joinLines,
  resolveGlobalPrefix,
  resolvePostgresSources,
  resolvePrimaryConnectionEnvKey,
  resolveRouteResources,
} from './utils';

export function generateNestInfraFiles(
  ir: ExportIR,
  options: NestExportOptions = {},
): GeneratedFile[] {
  if (ir.targets.server !== 'nest') {
    throw new NestExportError(`Nest exporter cannot generate server target "${ir.targets.server}"`);
  }

  const postgresSources = resolvePostgresSources(ir);
  if (postgresSources.length === 0) {
    throw new NestExportError('Nest infra export requires at least one PostgreSQL data source');
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
      description: 'Environment variable template for exported NestJS server',
    },
    {
      path: `${root}/main.ts`,
      content: generateMainTs(globalPrefix),
      encoding: 'utf-8',
      description: 'NestJS bootstrap entry point',
    },
    {
      path: `${root}/app.module.ts`,
      content: generateAppModule(routeResources),
      encoding: 'utf-8',
      description: 'Root application module',
    },
    {
      path: `${root}/database/database.module.ts`,
      content: generateDatabaseModule(),
      encoding: 'utf-8',
      description: 'PostgreSQL pool module',
    },
    {
      path: `${root}/database/database.service.ts`,
      content: generateDatabaseService(connectionEnvKey),
      encoding: 'utf-8',
      description: 'PostgreSQL query helper',
    },
    {
      path: 'README.export.server.md',
      content: generateReadme(ir, globalPrefix, connectionEnvKey),
      encoding: 'utf-8',
      description: 'Setup notes for exported NestJS server fragment',
    },
  ];

  for (const resource of routeResources) {
    files.push({
      path: `${root}/${resource.resourceName}/${resource.resourceName}.controller.ts`,
      content: generateController(resource),
      encoding: 'utf-8',
      description: `Route handler for ${resource.method} /${globalPrefix}/${resource.resourceName}`,
    });
    files.push({
      path: `${root}/${resource.resourceName}/${resource.resourceName}.module.ts`,
      content: generateFeatureModule(resource),
      encoding: 'utf-8',
      description: `Feature module for ${resource.resourceName}`,
    });
  }

  if (routeResources.length === 0) {
    const fallback = {
      routeId: 'fallback:list-records',
      resourceName: 'records',
      controllerName: 'RecordsController',
      moduleName: 'RecordsModule',
      tableName: postgresSources[0]?.table ?? 'records',
      method: 'GET' as const,
      globalPrefix,
    };
    files.push(
      {
        path: `${root}/records/records.controller.ts`,
        content: generateController(fallback),
        encoding: 'utf-8',
        description: 'Fallback list route when ExportIR has no routes',
      },
      {
        path: `${root}/records/records.module.ts`,
        content: generateFeatureModule(fallback),
        encoding: 'utf-8',
        description: 'Fallback records module',
      },
    );
  }

  return files;
}

function generateMainTs(globalPrefix: string): string {
  return joinLines([
    `import { Logger } from '@nestjs/common';`,
    `import { NestFactory } from '@nestjs/core';`,
    `import { AppModule } from './app.module';`,
    ``,
    `async function bootstrap() {`,
    `  const app = await NestFactory.create(AppModule);`,
    `  app.setGlobalPrefix('${globalPrefix}');`,
    `  app.enableCors({ origin: true });`,
    `  const port = process.env.PORT || 3000;`,
    `  await app.listen(port);`,
    `  Logger.log(\`Server running on http://localhost:\${port}/${globalPrefix}\`);`,
    `}`,
    ``,
    `void bootstrap();`,
    ``,
  ]);
}

function generateAppModule(routeResources: RouteResource[]): string {
  const modules =
    routeResources.length > 0
      ? routeResources
      : [{ moduleName: 'RecordsModule', resourceName: 'records' } as RouteResource];

  const imports = modules.map((resource) => `import { ${resource.moduleName} } from './${resource.resourceName}/${resource.resourceName}.module';`);
  const moduleList = modules.map((resource) => `    ${resource.moduleName},`).join('\n');

  return joinLines([
    `import { Module } from '@nestjs/common';`,
    `import { DatabaseModule } from './database/database.module';`,
    ...imports,
    ``,
    `@Module({`,
    `  imports: [`,
    `    DatabaseModule,`,
    moduleList,
    `  ],`,
    `})`,
    `export class AppModule {}`,
    ``,
  ]);
}

function generateDatabaseModule(): string {
  return joinLines([
    `import { Global, Module } from '@nestjs/common';`,
    `import { DatabaseService } from './database.service';`,
    ``,
    `@Global()`,
    `@Module({`,
    `  providers: [DatabaseService],`,
    `  exports: [DatabaseService],`,
    `})`,
    `export class DatabaseModule {}`,
    ``,
  ]);
}

function generateDatabaseService(connectionEnvKey: string): string {
  return joinLines([
    `import { Injectable, OnModuleDestroy } from '@nestjs/common';`,
    `import { Pool } from 'pg';`,
    ``,
    `@Injectable()`,
    `export class DatabaseService implements OnModuleDestroy {`,
    `  private readonly pool: Pool;`,
    ``,
    `  constructor() {`,
    `    const connectionString = process.env['${connectionEnvKey}'];`,
    `    if (!connectionString) {`,
    `      throw new Error('Missing required environment variable: ${connectionEnvKey}');`,
    `    }`,
    `    this.pool = new Pool({ connectionString });`,
    `  }`,
    ``,
    `  async queryRows(tableName: string, limit = 100): Promise<Record<string, unknown>[]> {`,
    `    const result = await this.pool.query(`,
    `      \`SELECT * FROM \${this.quoteIdentifier(tableName)} ORDER BY 1 LIMIT $1\`,`,
    `      [limit],`,
    `    );`,
    `    return result.rows;`,
    `  }`,
    ``,
    `  async onModuleDestroy(): Promise<void> {`,
    `    await this.pool.end();`,
    `  }`,
    ``,
    `  private quoteIdentifier(value: string): string {`,
    `    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {`,
    `      throw new Error(\`Unsafe SQL identifier: \${value}\`);`,
    `    }`,
    `    return \`"\${value.replace(/"/g, '""')}"\`;`,
    `  }`,
    `}`,
    ``,
  ]);
}

function generateController(resource: RouteResource): string {
  return joinLines([
    `import { Controller, Get } from '@nestjs/common';`,
    `import { DatabaseService } from '../database/database.service';`,
    ``,
    `@Controller('${resource.resourceName}')`,
    `export class ${resource.controllerName} {`,
    `  constructor(private readonly database: DatabaseService) {}`,
    ``,
    `  @Get()`,
    `  listRecords() {`,
    `    return this.database.queryRows('${resource.tableName}');`,
    `  }`,
    `}`,
    ``,
  ]);
}

function generateFeatureModule(resource: RouteResource): string {
  return joinLines([
    `import { Module } from '@nestjs/common';`,
    `import { ${resource.controllerName} } from './${resource.resourceName}.controller';`,
    ``,
    `@Module({`,
    `  controllers: [${resource.controllerName}],`,
    `})`,
    `export class ${resource.moduleName} {}`,
    ``,
  ]);
}

function generateReadme(ir: ExportIR, globalPrefix: string, connectionEnvKey: string): string {
  const routes =
    ir.routes.length > 0
      ? ir.routes.map((route) => `- \`${route.method} ${route.path}\``)
      : [`- \`GET /${globalPrefix}/records\` (fallback when IR routes are empty)`];

  return joinLines([
    `# ${ir.meta.compositeName} — NestJS Server Export`,
    ``,
    `Generated at ${ir.meta.generatedAt} from composite \`${ir.meta.compositeId}\` v${ir.meta.version}.`,
    ``,
    `## Files`,
    ``,
    `- \`server/src/main.ts\` — NestJS bootstrap with \`/${globalPrefix}\` global prefix`,
    `- \`server/src/database/*\` — PostgreSQL pool module using \`${connectionEnvKey}\``,
    `- \`server/src/*/*.controller.ts\` — list endpoints derived from ExportIR routes`,
    `- \`.env.example\` — required environment variables`,
    ``,
    `## Routes`,
    ``,
    ...routes,
    ``,
    `## Setup`,
    ``,
    `1. Copy the generated \`server/\` folder into your NestJS app (or use it as a starter).`,
    `2. Install dependencies: \`npm install pg @types/pg\`.`,
    `3. Copy \`.env.example\` to \`.env\` and set \`${connectionEnvKey}\`.`,
    `4. Ensure the referenced PostgreSQL tables exist.`,
    `5. Start the server and verify routes respond with row data.`,
    ``,
  ]);
}
