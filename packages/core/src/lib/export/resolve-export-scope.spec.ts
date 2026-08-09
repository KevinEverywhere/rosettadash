import { defaultComponentRegistry } from '../registry/component-registry';
import { resolveExportComposite } from './resolve-export-scope';

describe('resolveExportComposite', () => {
  const registry = defaultComponentRegistry;

  function buildDashboardComposite() {
    const postgres = registry.createNode('infra.postgresql', { id: 'pg1' });
    const server = registry.createNode('infra.server.nest', { id: 'srv1' });
    const dateRange = registry.createNode('visual.input.date-range', { id: 'dr1' });
    const table = registry.createNode('visual.table', { id: 'tbl1' });
    const chart = registry.createNode('visual.chart.line', { id: 'cht1' });
    const kpi = registry.createNode('visual.kpi', { id: 'kpi1' });

    return {
      id: 'c1',
      name: 'Dashboard',
      version: 1,
      nodes: [postgres, server, dateRange, table, chart, kpi],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'pg1',
          sourcePortId: 'rowset',
          targetNodeId: 'tbl1',
          targetPortId: 'data',
        },
        {
          id: 'b2',
          sourceNodeId: 'pg1',
          sourcePortId: 'rowset',
          targetNodeId: 'cht1',
          targetPortId: 'data',
        },
        {
          id: 'b3',
          sourceNodeId: 'dr1',
          sourcePortId: 'range',
          targetNodeId: 'tbl1',
          targetPortId: 'filter',
        },
        {
          id: 'b4',
          sourceNodeId: 'dr1',
          sourcePortId: 'range',
          targetNodeId: 'cht1',
          targetPortId: 'range',
        },
      ],
    };
  }

  it('returns the full composite for full scope', () => {
    const composite = buildDashboardComposite();
    const resolved = resolveExportComposite(composite, { scope: 'full' });
    expect(resolved.nodes).toHaveLength(6);
    expect(resolved.bindings).toHaveLength(4);
  });

  it('exports a single node with upstream dependencies only', () => {
    const composite = buildDashboardComposite();
    const resolved = resolveExportComposite(composite, {
      scope: 'single',
      seedNodeIds: ['tbl1'],
    });

    expect(resolved.nodes.map((node) => node.id).sort()).toEqual(['dr1', 'pg1', 'tbl1']);
    expect(resolved.bindings.map((binding) => binding.id).sort()).toEqual(['b1', 'b3']);
  });

  it('exports the binding neighborhood for selection scope', () => {
    const composite = buildDashboardComposite();
    const resolved = resolveExportComposite(composite, {
      scope: 'selection',
      seedNodeIds: ['tbl1'],
    });

    expect(resolved.nodes.map((node) => node.id).sort()).toEqual(['cht1', 'dr1', 'pg1', 'tbl1']);
    expect(resolved.bindings.map((binding) => binding.id).sort()).toEqual(['b1', 'b2', 'b3', 'b4']);
  });

  it('returns an empty graph when scoped without seed nodes', () => {
    const composite = buildDashboardComposite();
    const resolved = resolveExportComposite(composite, {
      scope: 'single',
      seedNodeIds: [],
    });

    expect(resolved.nodes).toHaveLength(0);
    expect(resolved.bindings).toHaveLength(0);
  });
});
