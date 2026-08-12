import { buildExportIR, defaultComponentRegistry } from '@rosettadash/core';
import { generateVueUiFiles } from './generate-vue-ui';

describe('generateVueUiFiles', () => {
  const registry = defaultComponentRegistry;

  it('generates Vue files for a bound dashboard composite', () => {
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
        exportTargets: { ui: 'vue', server: 'nest' },
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

    const files = generateVueUiFiles(ir);
    const paths = files.map((file) => file.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        'src/Dashboard.vue',
        'src/types.ts',
        'src/styles/tokens.css',
        'README.export.md',
        expect.stringMatching(/^src\/components\/.*\.vue$/),
        'src/composables/usePg1Data.ts',
      ]),
    );

    const dashboard = files.find((file) => file.path === 'src/Dashboard.vue');
    expect(dashboard?.content).toContain('Sales Dashboard');
    expect(dashboard?.content).toContain('usePg1Data');
    expect(dashboard?.content).toContain('dr1_range');
    expect(dashboard?.content).toContain('pg1Data.data ?? []');

    const composable = files.find((file) => file.path === 'src/composables/usePg1Data.ts');
    expect(composable?.content).toContain("fetch('/api/sales')");

    const dateRangeComponent = files.find((file) => file.path.includes('DateRange'));
    expect(dateRangeComponent?.content).toContain('<script setup lang="ts">');
    expect(dateRangeComponent?.content).toContain('defineModel');

    const tableComponent = files.find((file) => file.path.includes('DataTable'));
    expect(tableComponent?.content).toContain('computed');

    const chartComponent = files.find((file) => file.path.includes('LineChart'));
    expect(chartComponent?.content).toContain('polyline');

    expect(files.filter((file) => file.path.startsWith('src/components/'))).toHaveLength(3);
  });

  it('generates Vue pie chart component template', () => {
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
        exportTargets: { ui: 'vue', server: 'nest' },
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

    const files = generateVueUiFiles(ir);
    const pieFile = files.find((file) => file.path.includes('PieChart'));
    expect(pieFile?.content).toContain('conic-gradient');
    expect(pieFile?.content).toContain('pie-chart--donut');
  });

  it('generates Vue table and detail panel with row selection wiring', () => {
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
        exportTargets: { ui: 'vue', server: 'nest' },
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

    const files = generateVueUiFiles(ir);
    const detailFile = files.find((file) => file.path.includes('DetailPanel'));
    const tableFile = files.find((file) => file.path.includes('DataTable'));
    const dashboard = files.find((file) => file.path === 'src/Dashboard.vue');

    expect(detailFile?.content).toContain('detail-panel__fields');
    expect(tableFile?.content).toContain('selectRow');
    expect(dashboard?.content).toContain('t1_selected_row');
  });

  it('generates Vue three.js scatter plot stub', () => {
    const scatter = registry.createNode('visual.display.3d-scatter', { id: 's3d1' });
    const postgres = registry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'sales' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: '3D Scatter Dashboard',
        version: 1,
        exportTargets: { ui: 'vue', server: 'nest' },
        nodes: [scatter, postgres, server],
        bindings: [
          {
            id: 'b1',
            sourceNodeId: 'pg1',
            sourcePortId: 'rowset',
            targetNodeId: 's3d1',
            targetPortId: 'data',
          },
        ],
      },
      registry,
    );

    const files = generateVueUiFiles(ir);
    const scatterFile = files.find((file) => file.content.includes('@tresjs/core'));
    expect(scatterFile?.content).toContain('mapScatterPoints');
    expect(scatterFile?.content).toContain('TresSphereGeometry');
  });

  it('generates Vue three.js GLTF model stub', () => {
    const model = registry.createNode('visual.display.3d-gltf-model', { id: 'g3d1' });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'GLTF Dashboard',
        version: 1,
        exportTargets: { ui: 'vue', server: 'nest' },
        nodes: [model, server],
        bindings: [],
      },
      registry,
    );

    const files = generateVueUiFiles(ir);
    const modelFile = files.find((file) => file.content.includes('useGLTF'));
    expect(modelFile?.content).toContain('modelUrl');
  });

  it('generates Vue three.js geo globe stub', () => {
    const globe = registry.createNode('visual.display.3d-geo-globe', { id: 'globe1' });
    const postgres = registry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'locations' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Globe Dashboard',
        version: 1,
        exportTargets: { ui: 'vue', server: 'nest' },
        nodes: [globe, postgres, server],
        bindings: [
          {
            id: 'b1',
            sourceNodeId: 'pg1',
            sourcePortId: 'rowset',
            targetNodeId: 'globe1',
            targetPortId: 'data',
          },
        ],
      },
      registry,
    );

    const files = generateVueUiFiles(ir);
    const globeFile = files.find((file) => file.content.includes('mapGlobeMarkers'));
    expect(globeFile?.content).toContain('useTexture');
    expect(globeFile?.content).toContain('latField');
  });

  it('generates Vue SVG inline and WASM worker stubs', () => {
    const svg = registry.createNode('visual.svg.inline', { id: 'svg1' });
    const worker = registry.createNode('visual.wasm.worker-host', { id: 'ww1' });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'SVG WASM Dashboard',
        version: 1,
        exportTargets: { ui: 'vue', server: 'nest' },
        nodes: [svg, worker, server],
        bindings: [],
      },
      registry,
    );

    const files = generateVueUiFiles(ir);
    expect(files.some((file) => file.content.includes('v-html="markup"'))).toBe(true);
    expect(files.some((file) => file.content.includes('wasm-worker'))).toBe(true);
  });

  it('rejects non-vue UI targets', () => {
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

    expect(() => generateVueUiFiles(ir)).toThrow(/cannot generate UI target "react"/);
  });
});
