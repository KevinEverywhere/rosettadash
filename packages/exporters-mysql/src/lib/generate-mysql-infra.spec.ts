import { buildExportIR, defaultComponentRegistry } from '@dashbuilder/core';
import { generateMysqlInfraFiles } from './generate-mysql-infra';
import { MysqlExportError } from './types';

describe('generateMysqlInfraFiles', () => {
  const registry = defaultComponentRegistry;

  it('generates MySQL database files for a mysql-backed composite', () => {
    const table = registry.createNode('visual.table', { id: 't1' });
    const mysql = registry.createNode('infra.mysql', {
      id: 'my1',
      properties: { connectionEnvKey: 'MYSQL_URL', table: 'sales' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Sales Dashboard',
        version: 2,
        exportTargets: { ui: 'react', server: 'nest', database: 'mysql' },
        nodes: [table, mysql, server],
        bindings: [
          {
            id: 'b1',
            sourceNodeId: 'my1',
            sourcePortId: 'rowset',
            targetNodeId: 't1',
            targetPortId: 'data',
          },
        ],
      },
      registry,
      { generatedAt: '2026-08-08T00:00:00.000Z' },
    );

    const files = generateMysqlInfraFiles(ir);
    const paths = files.map((file) => file.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        '.env.example',
        'database/src/mysql.pool.ts',
        'database/src/queries/list-rows.ts',
        'database/src/tables/sales.ts',
        'README.export.database.md',
      ]),
    );

    const tableModule = files.find((file) => file.path === 'database/src/tables/sales.ts');
    expect(tableModule?.content).toContain('listSalesRows');
    expect(tableModule?.content).toContain("'sales'");

    const pool = files.find((file) => file.path === 'database/src/mysql.pool.ts');
    expect(pool?.content).toContain("process.env['MYSQL_URL']");
    expect(pool?.content).toContain('mysql2/promise');

    const env = files.find((file) => file.path === '.env.example');
    expect(env?.content).toContain('MYSQL_URL=');
  });

  it('rejects non-mysql database targets', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Mongo only',
        version: 1,
        exportTargets: { ui: 'react', server: 'nest', database: 'mongodb' },
        nodes: [
          registry.createNode('infra.mysql', {
            id: 'my1',
            properties: { table: 'sales' },
          }),
        ],
        bindings: [],
      },
      registry,
    );

    expect(() => generateMysqlInfraFiles(ir)).toThrow(/cannot generate database target "mongodb"/);
  });

  it('requires a MySQL data source', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'No database',
        version: 1,
        exportTargets: { ui: 'react', server: 'nest', database: 'mysql' },
        nodes: [registry.createNode('infra.server.nest', { id: 's1' })],
        bindings: [],
      },
      registry,
    );

    expect(() => generateMysqlInfraFiles(ir)).toThrow(MysqlExportError);
    expect(() => generateMysqlInfraFiles(ir)).toThrow(/MySQL data source/);
  });
});
