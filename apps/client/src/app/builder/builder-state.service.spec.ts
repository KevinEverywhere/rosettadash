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

  it('builds composite payload from current nodes', () => {
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
    expect(payload.version).toBe(1);
  });
});
