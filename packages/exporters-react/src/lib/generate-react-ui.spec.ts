import { buildExportIR, defaultComponentRegistry } from '@dashbuilder/core';
import { generateReactUiFiles } from './generate-react-ui';

describe('generateReactUiFiles', () => {
  const registry = defaultComponentRegistry;

  it('generates React files for a bound dashboard composite', () => {
    const dateRange = registry.createNode('visual.input.date-range', { id: 'dr1' });
    const table = registry.createNode('visual.table', { id: 't1' });
    const chart = registry.createNode('visual.chart.line', { id: 'c1' });
    const postgres = registry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'sales' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Sales Dashboard',
        version: 2,
        exportTargets: { ui: 'react', server: 'nest' },
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

    const files = generateReactUiFiles(ir);
    const paths = files.map((file) => file.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        'src/Dashboard.tsx',
        'src/types.ts',
        'src/styles/tokens.css',
        'README.export.md',
        expect.stringMatching(/^src\/components\/.*\.tsx$/),
        'src/hooks/usePg1Data.ts',
      ]),
    );

    const dashboard = files.find((file) => file.path === 'src/Dashboard.tsx');
    expect(dashboard?.content).toContain('Sales Dashboard');
    expect(dashboard?.content).toContain('usePg1Data');
    expect(dashboard?.content).toContain('dr1_range');
    expect(dashboard?.content).toContain('pg1_rowset ?? []');

    const hook = files.find((file) => file.path === 'src/hooks/usePg1Data.ts');
    expect(hook?.content).toContain("fetch('/api/sales')");

    expect(files.filter((file) => file.path.startsWith('src/components/'))).toHaveLength(3);
  });

  it('rejects non-react UI targets', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Angular only',
        version: 1,
        exportTargets: { ui: 'angular', server: 'nest' },
        nodes: [registry.createNode('visual.kpi', { id: 'k1' })],
        bindings: [],
      },
      registry,
    );

    expect(() => generateReactUiFiles(ir)).toThrow(/cannot generate UI target "angular"/);
  });
});
