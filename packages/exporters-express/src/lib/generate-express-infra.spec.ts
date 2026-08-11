import { buildExportIR, defaultComponentRegistry } from '@rosettadash/core';
import { generateExpressInfraFiles } from './generate-express-infra';
import { ExpressExportError } from './types';

describe('generateExpressInfraFiles', () => {
  const registry = defaultComponentRegistry;

  it('generates Express server files for a postgres-backed composite', () => {
    const dateRange = registry.createNode('visual.input.date-range', { id: 'dr1' });
    const table = registry.createNode('visual.table', { id: 't1' });
    const chart = registry.createNode('visual.chart.line', { id: 'c1' });
    const postgres = registry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'sales' },
    });
    const server = registry.createNode('infra.server.express', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Sales Dashboard',
        version: 2,
        exportTargets: { ui: 'react', server: 'express', database: 'postgresql' },
        nodes: [dateRange, table, chart, postgres, server],
        bindings: [
          {
            id: 'b1',
            sourceNodeId: 'pg1',
            sourcePortId: 'rowset',
            targetNodeId: 't1',
            targetPortId: 'data',
          },
          {
            id: 'b2',
            sourceNodeId: 'dr1',
            sourcePortId: 'range',
            targetNodeId: 't1',
            targetPortId: 'filter',
          },
          {
            id: 'b3',
            sourceNodeId: 'dr1',
            sourcePortId: 'range',
            targetNodeId: 'c1',
            targetPortId: 'range',
          },
          {
            id: 'b4',
            sourceNodeId: 'pg1',
            sourcePortId: 'rowset',
            targetNodeId: 'c1',
            targetPortId: 'data',
          },
        ],
      },
      registry,
      { generatedAt: '2026-08-08T00:00:00.000Z' },
    );

    const files = generateExpressInfraFiles(ir);
    const paths = files.map((file) => file.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        '.env.example',
        'server/src/index.ts',
        'server/src/database/pool.ts',
        'server/src/routes/sales.ts',
        'README.export.server.md',
      ]),
    );

    const route = files.find((file) => file.path === 'server/src/routes/sales.ts');
    expect(route?.content).toContain('createSalesRouter');
    expect(route?.content).toContain("queryRows(pool, 'sales')");

    const index = files.find((file) => file.path === 'server/src/index.ts');
    expect(index?.content).toContain("app.use('/api/sales', createSalesRouter(pool))");

    const pool = files.find((file) => file.path === 'server/src/database/pool.ts');
    expect(pool?.content).toContain("process.env['DATABASE_URL']");

    const env = files.find((file) => file.path === '.env.example');
    expect(env?.content).toContain('DATABASE_URL=');
  });

  it('rejects non-express server targets', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Nest only',
        version: 1,
        exportTargets: { ui: 'react', server: 'nest' },
        nodes: [
          registry.createNode('infra.postgresql', {
            id: 'pg1',
            properties: { table: 'sales' },
          }),
        ],
        bindings: [],
      },
      registry,
    );

    expect(() => generateExpressInfraFiles(ir)).toThrow(/cannot generate server target "nest"/);
  });

  it('requires a PostgreSQL data source', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'No database',
        version: 1,
        exportTargets: { ui: 'react', server: 'express' },
        nodes: [registry.createNode('infra.server.express', { id: 's1' })],
        bindings: [],
      },
      registry,
    );

    expect(() => generateExpressInfraFiles(ir)).toThrow(ExpressExportError);
    expect(() => generateExpressInfraFiles(ir)).toThrow(/PostgreSQL data source/);
  });
});
