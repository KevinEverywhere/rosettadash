import { defaultComponentRegistry } from '../registry/component-registry';
import {
  evaluateDefaults,
  suggestionsForSelectedNode,
} from './evaluate-defaults';
import type { Composite } from '../model/types';

describe('evaluateDefaults', () => {
  const registry = defaultComponentRegistry;

  function contextFrom(composite: Composite) {
    return {
      nodes: composite.nodes,
      bindings: composite.bindings,
    };
  }

  it('suggests companion components when a table is added without typical groupings', () => {
    const table = registry.createNode('visual.table', { id: 't1' });

    const suggestions = evaluateDefaults(
      { nodes: [table], bindings: [] },
      { type: 'nodeAdded', nodeId: 't1' },
      registry,
    );

    expect(suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'companion:t1:visual.input.date-range',
          kind: 'hint',
          title: 'Typical grouping',
        }),
      ]),
    );
  });

  it('suggests pagination when a table is added without page size', () => {
    const table = registry.createNode('visual.table', {
      id: 't1',
      properties: { pageSize: 0 },
    });

    const suggestions = evaluateDefaults(
      { nodes: [table], bindings: [] },
      { type: 'nodeAdded', nodeId: 't1' },
      registry,
    );

    expect(suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'table-page-size:t1',
          kind: 'patch',
          patches: [{ key: 'pageSize', value: 25 }],
        }),
      ]),
    );
  });

  it('suggests a postgres table name when the table property is empty', () => {
    const postgres = registry.createNode('infra.postgresql', {
      id: 'pg1',
      properties: { table: '' },
    });

    const suggestions = evaluateDefaults(
      { nodes: [postgres], bindings: [] },
      { type: 'nodeAdded', nodeId: 'pg1' },
      registry,
    );

    expect(suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'postgres-table:pg1',
          patches: [{ key: 'table', value: 'records' }],
        }),
      ]),
    );
  });

  it('suggests binding a date range after rowset data is connected to a table', () => {
    const postgres = registry.createNode('infra.postgresql', { id: 'pg1' });
    const table = registry.createNode('visual.table', { id: 't1' });
    const dateRange = registry.createNode('visual.input.date-range', { id: 'd1' });

    const composite = {
      id: 'c1',
      name: 'Dashboard',
      version: 1,
      nodes: [postgres, table, dateRange],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'pg1',
          sourcePortId: 'rowset',
          targetNodeId: 't1',
          targetPortId: 'data',
        },
      ],
    };

    const suggestions = evaluateDefaults(
      contextFrom(composite),
      { type: 'bindingCreated', bindingId: 'b1' },
      registry,
    );

    expect(suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'bind-date-range:t1:filter',
          kind: 'hint',
        }),
      ]),
    );
  });

  it('suggests adding a date range component when none exists on the canvas', () => {
    const postgres = registry.createNode('infra.postgresql', { id: 'pg1' });
    const chart = registry.createNode('visual.chart.line', { id: 'c1' });

    const composite = {
      id: 'c1',
      name: 'Dashboard',
      version: 1,
      nodes: [postgres, chart],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'pg1',
          sourcePortId: 'rowset',
          targetNodeId: 'c1',
          targetPortId: 'data',
        },
      ],
    };

    const suggestions = evaluateDefaults(
      contextFrom(composite),
      { type: 'bindingCreated', bindingId: 'b1' },
      registry,
    );

    expect(suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'add-date-range:c1',
          message: expect.stringContaining('Add a Date Range component'),
        }),
      ]),
    );
  });

  it('omits dismissed suggestions', () => {
    const table = registry.createNode('visual.table', {
      id: 't1',
      properties: { pageSize: 0 },
    });

    const suggestions = evaluateDefaults(
      { nodes: [table], bindings: [] },
      { type: 'nodeAdded', nodeId: 't1' },
      registry,
      { dismissedIds: new Set(['table-page-size:t1']) },
    );

    expect(suggestions.some((suggestion) => suggestion.id === 'table-page-size:t1')).toBe(false);
  });
});

describe('suggestionsForSelectedNode', () => {
  const registry = defaultComponentRegistry;

  it('reports unbound required inputs for the selected node', () => {
    const table = registry.createNode('visual.table', { id: 't1' });

    const suggestions = suggestionsForSelectedNode(
      { nodes: [table], bindings: [] },
      't1',
      registry,
    );

    expect(suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'bind-required:t1:data',
          kind: 'hint',
        }),
      ]),
    );
  });
});
