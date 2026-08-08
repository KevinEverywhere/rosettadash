import { defaultComponentRegistry } from '../registry/component-registry';
import { ExportBuildError, buildExportIR } from './build-export-ir';

describe('buildExportIR', () => {
  const registry = defaultComponentRegistry;

  it('builds IR from a strictly valid dashboard composite', () => {
    const dateRange = registry.createNode('visual.input.date-range', { id: 'dr1' });
    const table = registry.createNode('visual.table', { id: 't1' });
    const chart = registry.createNode('visual.chart.line', { id: 'c1' });
    const postgres = registry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'sales' },
    });
    const server = registry.createNode('infra.server.nest', { id: 's1' });

    const composite = {
      id: 'comp1',
      name: 'Sales Dashboard',
      version: 2,
      exportTargets: { ui: 'react' as const, server: 'nest' as const },
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
    };

    const ir = buildExportIR(composite, registry, {
      generatedAt: '2026-08-08T00:00:00.000Z',
    });

    expect(ir.meta).toEqual({
      compositeId: 'comp1',
      compositeName: 'Sales Dashboard',
      version: 2,
      generatedAt: '2026-08-08T00:00:00.000Z',
    });
    expect(ir.targets.ui).toBe('react');
    expect(ir.targets.server).toBe('nest');
    expect(ir.components).toHaveLength(3);
    expect(ir.dataSources).toHaveLength(2);
    expect(ir.events).toHaveLength(4);
    expect(ir.events[0]?.dataType).toBe('rowset');
    expect(ir.envVars.some((env) => env.key === 'DATABASE_URL')).toBe(true);
    expect(ir.routes).toEqual([
      expect.objectContaining({
        method: 'GET',
        path: '/api/sales',
        handlerNodeId: 's1',
      }),
    ]);
  });

  it('throws ExportBuildError when composite fails strict validation', () => {
    const table = registry.createNode('visual.table', { id: 't1' });

    expect(() =>
      buildExportIR(
        {
          id: 'c1',
          name: 'Invalid',
          nodes: [table],
          bindings: [],
          version: 1,
        },
        registry,
      ),
    ).toThrow(ExportBuildError);
  });

  it('uses default export targets when none are configured', () => {
    const text = registry.createNode('visual.input.text', { id: 'n1' });

    const ir = buildExportIR(
      {
        id: 'c1',
        name: 'Minimal',
        nodes: [text],
        bindings: [],
        version: 1,
      },
      registry,
    );

    expect(ir.targets).toEqual({
      ui: 'react',
      server: 'nest',
      database: 'postgresql',
    });
  });
});
