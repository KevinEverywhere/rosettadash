import { buildExportIR, defaultComponentRegistry } from '@dashbuilder/core';
import { generateMongoInfraFiles } from './generate-mongo-infra';
import { MongoExportError } from './types';

describe('generateMongoInfraFiles', () => {
  const registry = defaultComponentRegistry;

  it('generates MongoDB database files for a mongo-backed composite', () => {
    const table = registry.createNode('visual.table', { id: 't1' });
    const mongo = registry.createNode('infra.mongodb', {
      id: 'mg1',
      properties: { connectionEnvKey: 'MONGODB_URI', collection: 'sales' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Sales Dashboard',
        version: 2,
        exportTargets: { ui: 'react', server: 'nest', database: 'mongodb' },
        nodes: [table, mongo, server],
        bindings: [
          {
            id: 'b1',
            sourceNodeId: 'mg1',
            sourcePortId: 'documents',
            targetNodeId: 't1',
            targetPortId: 'data',
          },
        ],
      },
      registry,
      { generatedAt: '2026-08-08T00:00:00.000Z' },
    );

    const files = generateMongoInfraFiles(ir);
    const paths = files.map((file) => file.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        '.env.example',
        'database/src/mongo.client.ts',
        'database/src/queries/list-documents.ts',
        'database/src/collections/sales.ts',
        'README.export.database.md',
      ]),
    );

    const collection = files.find((file) => file.path === 'database/src/collections/sales.ts');
    expect(collection?.content).toContain('listSalesDocuments');
    expect(collection?.content).toContain("'sales'");

    const client = files.find((file) => file.path === 'database/src/mongo.client.ts');
    expect(client?.content).toContain("process.env['MONGODB_URI']");

    const env = files.find((file) => file.path === '.env.example');
    expect(env?.content).toContain('MONGODB_URI=');
  });

  it('rejects non-mongodb database targets', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Postgres only',
        version: 1,
        exportTargets: { ui: 'react', server: 'nest', database: 'postgresql' },
        nodes: [
          registry.createNode('infra.mongodb', {
            id: 'mg1',
            properties: { collection: 'sales' },
          }),
        ],
        bindings: [],
      },
      registry,
    );

    expect(() => generateMongoInfraFiles(ir)).toThrow(/cannot generate database target "postgresql"/);
  });

  it('requires a MongoDB data source', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'No database',
        version: 1,
        exportTargets: { ui: 'react', server: 'nest', database: 'mongodb' },
        nodes: [registry.createNode('infra.server.nest', { id: 's1' })],
        bindings: [],
      },
      registry,
    );

    expect(() => generateMongoInfraFiles(ir)).toThrow(MongoExportError);
    expect(() => generateMongoInfraFiles(ir)).toThrow(/MongoDB data source/);
  });
});
