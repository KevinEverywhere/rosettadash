import { buildExportIR, defaultComponentRegistry } from '@dashbuilder/core';
import { generateWebComponentsUiFiles } from './generate-web-components-ui';

describe('generateWebComponentsUiFiles', () => {
  const registry = defaultComponentRegistry;

  it('generates Custom Element files for a bound dashboard composite', () => {
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
        exportTargets: { ui: 'web-components', server: 'nest' },
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

    const files = generateWebComponentsUiFiles(ir);
    const paths = files.map((file) => file.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        'src/dashboard.ts',
        'src/register.ts',
        'src/define-element.ts',
        'src/types.ts',
        'src/styles/tokens.css',
        'README.export.md',
        expect.stringMatching(/^src\/components\/.*\.ts$/),
        'src/lib/data/fetchPg1Data.ts',
      ]),
    );

    const dashboard = files.find((file) => file.path === 'src/dashboard.ts');
    expect(dashboard?.content).toContain('Sales Dashboard');
    expect(dashboard?.content).toContain('fetchPg1Data');
    expect(dashboard?.content).toContain('defineDashElement');
    expect(dashboard?.content).toContain('DbDashboard');

    const dataModule = files.find((file) => file.path === 'src/lib/data/fetchPg1Data.ts');
    expect(dataModule?.content).toContain("fetch('/api/sales')");

    const dateRangeComponent = files.find((file) => file.path.includes('DateRange'));
    expect(dateRangeComponent?.content).toContain('range-change');

    const tableComponent = files.find((file) => file.path.includes('DataTable'));
    expect(tableComponent?.content).toContain('row-select');

    const chartComponent = files.find((file) => file.path.includes('LineChart'));
    expect(chartComponent?.content).toContain('polyline');

    expect(files.filter((file) => file.path.startsWith('src/components/'))).toHaveLength(3);
  });

  it('generates Web Components pie chart template', () => {
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
        exportTargets: { ui: 'web-components', server: 'nest' },
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

    const files = generateWebComponentsUiFiles(ir);
    const pieComponent = files.find((file) => file.path.includes('PieChart'));
    expect(pieComponent?.content).toContain('pie-chart');
    expect(pieComponent?.content).toContain('defineDashElement');
  });

  it('rejects non-web-components UI targets', () => {
    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Wrong target',
        version: 1,
        exportTargets: { ui: 'react', server: 'nest' },
        nodes: [registry.createNode('visual.kpi', { id: 'k1' })],
        bindings: [],
      },
      registry,
    );

    expect(() => generateWebComponentsUiFiles(ir)).toThrow(/cannot generate UI target "react"/);
  });

  it('defaults to standalone equirect pipeline (no runtime package imports)', () => {
    const video = registry.createNode('visual.media.video-source', { id: 'vs1' });
    const viewport = registry.createNode('visual.media.equirect-viewport', { id: 'ev1' });
    const media = registry.createNode('visual.wasm.media', {
      id: 'wm1',
      properties: { operation: 'equirect-extract', extractionMode: 'flat-crop' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Equirect Export',
        version: 1,
        exportTargets: { ui: 'web-components', server: 'nest' },
        nodes: [video, viewport, media, server],
        bindings: [],
      },
      registry,
    );

    const files = generateWebComponentsUiFiles(ir);
    expect(files.some((file) => file.path === 'package.json.fragment.json')).toBe(false);
    expect(files.filter((file) => file.path.startsWith('src/components/')).length).toBe(3);
    const register = files.find((file) => file.path === 'src/register.ts');
    expect(register?.content).not.toContain('@dashbuilder/web-components');
    const readme = files.find((file) => file.path === 'README.export.md');
    expect(readme?.content).toContain('Standalone export');
  });

  it('generates package-mode equirect pipeline with runtime imports', () => {
    const video = registry.createNode('visual.media.video-source', { id: 'vs1' });
    const viewport = registry.createNode('visual.media.equirect-viewport', { id: 'ev1' });
    const media = registry.createNode('visual.wasm.media', {
      id: 'wm1',
      properties: { operation: 'equirect-extract', extractionMode: 'flat-crop' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Equirect Export',
        version: 1,
        exportTargets: { ui: 'web-components', server: 'nest' },
        nodes: [video, viewport, media, server],
        bindings: [
          {
            id: 'b1',
            sourceNodeId: 'ev1',
            sourcePortId: 'crop-region',
            targetNodeId: 'wm1',
            targetPortId: 'crop-region',
          },
          {
            id: 'b2',
            sourceNodeId: 'vs1',
            sourcePortId: 'video-file',
            targetNodeId: 'wm1',
            targetPortId: 'input-file',
          },
        ],
      },
      registry,
    );

    const files = generateWebComponentsUiFiles(ir, { exportMode: 'package' });
    const register = files.find((file) => file.path === 'src/register.ts');
    expect(register?.content).toContain('@dashbuilder/web-components');
    expect(register?.content).toContain('registerDashBuilderMediaElements');
    expect(register?.content).toContain('registerDashBuilderWasmElements');
    expect(files.some((file) => file.path === 'package.json.fragment.json')).toBe(true);
    expect(files.filter((file) => file.path.startsWith('src/components/')).length).toBe(0);

    const dashboard = files.find((file) => file.path === 'src/dashboard.ts');
    expect(dashboard?.content).toContain("document.createElement('db-video-source')");
    expect(dashboard?.content).toContain("document.createElement('db-wasm-media')");
    expect(dashboard?.content).toContain("addEventListener('video-file'");
    expect(dashboard?.content).toContain("addEventListener('crop-region'");
  });

  it('generates standalone-mode equirect component files', () => {
    const video = registry.createNode('visual.media.video-source', { id: 'vs1' });
    const media = registry.createNode('visual.wasm.media', {
      id: 'wm1',
      properties: { operation: 'equirect-extract' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const ir = buildExportIR(
      {
        id: 'comp1',
        name: 'Standalone Equirect',
        version: 1,
        exportTargets: { ui: 'web-components', server: 'nest' },
        nodes: [video, media, server],
        bindings: [],
      },
      registry,
    );

    const files = generateWebComponentsUiFiles(ir, { exportMode: 'standalone' });
    expect(files.filter((file) => file.path.startsWith('src/components/')).length).toBe(2);
    const wasm = files.find((file) => file.content.includes('@ffmpeg/ffmpeg'));
    expect(wasm?.content).toContain('buildEquirectExtractFilter');
  });
});
