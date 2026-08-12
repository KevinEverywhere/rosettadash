import { defaultComponentRegistry } from '../registry/component-registry';
import { diffComposite } from './diff-composite';
import type { Composite } from '../model/types';

function createComposite(overrides: Partial<Composite> = {}): Composite {
  const node = defaultComponentRegistry.createNode('visual.input.text', { id: 'n1' });
  return {
    id: 'c1',
    name: 'Main',
    nodes: [node],
    bindings: [],
    version: 1,
    ...overrides,
  };
}

describe('diffComposite', () => {
  it('detects no changes between identical composites', () => {
    const composite = createComposite();
    const diff = diffComposite(composite, { ...composite, version: 2 });

    expect(diff.summary).toEqual({
      nodesAdded: 0,
      nodesRemoved: 0,
      nodesModified: 0,
      bindingsAdded: 0,
      bindingsRemoved: 0,
      bindingsModified: 0,
      metadataChanged: false,
    });
    expect(diff.changes).toHaveLength(0);
  });

  it('detects metadata, node, and binding changes', () => {
    const from = createComposite({ version: 1 });
    const addedNode = defaultComponentRegistry.createNode('visual.table', { id: 't1' });
    const to = createComposite({
      version: 2,
      name: 'Main updated',
      nodes: [...from.nodes, addedNode],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'n1',
          sourcePortId: 'value',
          targetNodeId: 't1',
          targetPortId: 'rows',
        },
      ],
    });

    const diff = diffComposite(from, to);

    expect(diff.summary.nodesAdded).toBe(1);
    expect(diff.summary.bindingsAdded).toBe(1);
    expect(diff.summary.metadataChanged).toBe(true);
    expect(diff.changes.some((change) => change.kind === 'metadata-changed')).toBe(true);
    expect(diff.changes.some((change) => change.kind === 'node-added')).toBe(true);
    expect(diff.changes.some((change) => change.kind === 'binding-added')).toBe(true);
  });

  it('detects node property modifications', () => {
    const from = createComposite({ version: 1 });
    const modifiedNode = {
      ...from.nodes[0],
      properties: { ...from.nodes[0].properties, placeholder: 'Updated' },
    };
    const to = createComposite({
      version: 2,
      nodes: [modifiedNode],
    });

    const diff = diffComposite(from, to);

    expect(diff.summary.nodesModified).toBe(1);
    expect(diff.changes).toEqual([
      {
        kind: 'node-modified',
        nodeId: 'n1',
        label: modifiedNode.label,
        fields: ['properties'],
      },
    ]);
  });
});
