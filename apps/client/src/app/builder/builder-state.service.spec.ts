import { defaultComponentRegistry } from '@dashbuilder/core';
import { BuilderStateService } from './builder-state.service';

describe('BuilderStateService', () => {
  let service: BuilderStateService;

  beforeEach(() => {
    service = new BuilderStateService();
  });

  it('adds nodes from the registry', () => {
    const definition = defaultComponentRegistry.getOrThrow('visual.input.text');
    const node = service.addNodeFromDefinition(definition);

    expect(service.nodes()).toHaveLength(1);
    expect(service.selectedNode()?.id).toBe(node.id);
    expect(service.dirty()).toBe(true);
  });

  it('updates node properties', () => {
    const definition = defaultComponentRegistry.getOrThrow('visual.kpi');
    const node = service.addNodeFromDefinition(definition);

    service.updateNodeProperty(node.id, 'title', 'Revenue');
    expect(service.selectedNode()?.properties['title']).toBe('Revenue');
  });

  it('builds composite payload from current nodes and bindings', () => {
    service.setProjectContext(
      {
        id: 'p1',
        name: 'Test',
        composites: [],
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'c1',
        name: 'Main',
        nodes: [],
        bindings: [],
        version: 1,
      },
    );

    const definition = defaultComponentRegistry.getOrThrow('visual.input.text');
    service.addNodeFromDefinition(definition);

    const payload = service.buildCompositePayload();
    expect(payload.nodes).toHaveLength(1);
    expect(payload.bindings).toEqual([]);
    expect(payload.version).toBe(1);
  });

  it('creates compatible bindings and replaces existing target bindings', () => {
    const firstDateRange = service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('visual.input.date-range'),
    );
    const secondDateRange = service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('visual.input.date-range'),
    );
    const chart = service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('visual.chart.line'),
    );

    const first = service.createBinding(firstDateRange.id, 'range', chart.id, 'range');
    expect(first.ok).toBe(true);
    expect(service.bindings()).toHaveLength(1);

    const second = service.createBinding(
      secondDateRange.id,
      'range',
      chart.id,
      'range',
    );
    expect(second.ok).toBe(true);
    expect(service.bindings()).toHaveLength(1);
    expect(service.bindings()[0]?.sourceNodeId).toBe(secondDateRange.id);
  });

  it('rejects incompatible bindings', () => {
    const text = service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('visual.input.text'),
    );
    const chart = service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('visual.chart.line'),
    );

    const result = service.createBinding(text.id, 'value', chart.id, 'data');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Incompatible types');
    }
    expect(service.bindings()).toHaveLength(0);
  });

  it('filters preview nodes to visual components only', () => {
    service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('visual.input.text'),
    );
    service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('infra.postgresql'),
    );

    expect(service.previewNodes()).toHaveLength(1);
    expect(service.previewNodes()[0]?.type).toBe('visual.input.text');
  });

  it('switches workspace mode and clears pending bindings', () => {
    const dateRange = service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('visual.input.date-range'),
    );
    service.beginBindingFrom(dateRange.id, 'range');
    expect(service.pendingBindingSource()).not.toBeNull();

    service.setWorkspaceMode('preview');
    expect(service.workspaceMode()).toBe('preview');
    expect(service.pendingBindingSource()).toBeNull();
  });

  it('removes bindings when a node is deleted', () => {
    const dateRange = service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('visual.input.date-range'),
    );
    const chart = service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('visual.chart.line'),
    );

    service.createBinding(dateRange.id, 'range', chart.id, 'range');
    service.selectNode(dateRange.id);
    service.removeSelectedNode();

    expect(service.bindings()).toHaveLength(0);
    expect(service.nodes()).toHaveLength(1);
  });

  it('stores defaults-engine suggestions when a table is added', () => {
    const table = service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('visual.table'),
    );

    expect(service.suggestionsForNode(table.id).some((s) => s.id === `bind-required:${table.id}:data`)).toBe(
      true,
    );
  });

  it('applies patch suggestions and marks the node as defaults-engine suggested', () => {
    const postgres = service.addNodeFromDefinition(
      defaultComponentRegistry.getOrThrow('infra.postgresql'),
    );

    const suggestion = service
      .suggestionsForNode(postgres.id)
      .find((entry) => entry.id === `postgres-table:${postgres.id}`);
    expect(suggestion).toBeDefined();
    if (!suggestion) {
      return;
    }

    service.applySuggestion(suggestion.id);

    expect(service.selectedNode()?.properties['table']).toBe('records');
    expect(service.selectedNode()?.meta?.suggestedBy).toBe('defaults-engine');
    expect(service.suggestionsForNode(postgres.id)).toHaveLength(0);
  });
});
