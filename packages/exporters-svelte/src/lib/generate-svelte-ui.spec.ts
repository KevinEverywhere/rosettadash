import { buildExportIR, defaultComponentRegistry } from '@dashbuilder/core';
import { generateSvelteUiFiles } from './generate-svelte-ui';

describe('generateSvelteUiFiles', () => {
  const registry = defaultComponentRegistry;

  it('generates Svelte files for a bound dashboard composite', () => {
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
        exportTargets: { ui: 'svelte', server: 'nest' },
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

    const files = generateSvelteUiFiles(ir);
    const paths = files.map((file) => file.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        'src/Dashboard.svelte',
        'src/types.ts',
        'src/styles/tokens.css',
        'README.export.md',
        expect.stringMatching(/^src\/components\/.*\.svelte$/),
        'src/lib/data/usePg1Data.svelte.ts',
      ]),
    );

    const dashboard = files.find((file) => file.path === 'src/Dashboard.svelte');
    expect(dashboard?.content).toContain('Sales Dashboard');
    expect(dashboard?.content).toContain('usePg1Data');
    expect(dashboard?.content).toContain('dr1_range');
    expect(dashboard?.content).toContain('pg1Data.data ?? []');

    const dataModule = files.find((file) => file.path === 'src/lib/data/usePg1Data.svelte.ts');
    expect(dataModule?.content).toContain("fetch('/api/sales')");
    expect(dataModule?.content).toContain('$effect');

    const dateRangeComponent = files.find((file) => file.path.includes('DateRange'));
    expect(dateRangeComponent?.content).toContain('$bindable');

    const tableComponent = files.find((file) => file.path.includes('DataTable'));
    expect(tableComponent?.content).toContain('$derived');

    const chartComponent = files.find((file) => file.path.includes('LineChart'));
    expect(chartComponent?.content).toContain('polyline');

    expect(files.filter((file) => file.path.startsWith('src/components/'))).toHaveLength(3);
  });

  it('generates Svelte pie chart component template', () => {
    const pie = registry.createNode('visual.chart.pie', {
      id: 'p1',
      properties: { title: 'Breakdown', donut: true },
    });
    const postgres = registry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'sales' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Pie Dashboard',
        version: 1,
        exportTargets: { ui: 'svelte', server: 'nest' },
        nodes: [pie, postgres, server],
        bindings: [
          {
            id: 'b1',
            sourceNodeId: 'pg1',
            sourcePortId: 'rowset',
            targetNodeId: 'p1',
            targetPortId: 'data',
          },
        ],
      },
      registry,
    );

    const files = generateSvelteUiFiles(ir);
    const pieFile = files.find((file) => file.path.includes('PieChart'));
    expect(pieFile?.content).toContain('conic-gradient');
    expect(pieFile?.content).toContain('pie-chart--donut');
  });

  it('generates Svelte table and detail panel with row selection wiring', () => {
    const table = registry.createNode('visual.table', { id: 't1' });
    const detail = registry.createNode('visual.detail', { id: 'd1' });
    const postgres = registry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'sales' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'CRUD Dashboard',
        version: 1,
        exportTargets: { ui: 'svelte', server: 'nest' },
        nodes: [table, detail, postgres, server],
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
            sourceNodeId: 't1',
            sourcePortId: 'selected-row',
            targetNodeId: 'd1',
            targetPortId: 'row',
          },
        ],
      },
      registry,
    );

    const files = generateSvelteUiFiles(ir);
    const detailFile = files.find((file) => file.path.includes('DetailPanel'));
    const tableFile = files.find((file) => file.path.includes('DataTable'));
    const dashboard = files.find((file) => file.path === 'src/Dashboard.svelte');

    expect(detailFile?.content).toContain('detail-panel__fields');
    expect(tableFile?.content).toContain('onSelectRow');
    expect(dashboard?.content).toContain('t1_selected_row');
  });

  it('rejects non-svelte UI targets', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'React only',
        version: 1,
        exportTargets: { ui: 'react', server: 'nest' },
        nodes: [registry.createNode('visual.kpi', { id: 'k1' })],
        bindings: [],
      },
      registry,
    );

    expect(() => generateSvelteUiFiles(ir)).toThrow(/cannot generate UI target "react"/);
  });
});
