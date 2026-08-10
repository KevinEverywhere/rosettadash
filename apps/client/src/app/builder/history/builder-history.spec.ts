import { describe, expect, it } from 'vitest';
import type { Binding, ComponentNode, Composite } from '@dashbuilder/core';
import {
  BuilderHistoryStack,
  cloneBuilderGraphSnapshot,
  type BuilderGraphSnapshot,
} from './builder-history';

function makeGraphSnapshot(
  nodes: ComponentNode[] = [],
  bindings: Binding[] = [],
  selectedNodeIds: string[] = [],
): BuilderGraphSnapshot {
  return {
    nodes,
    bindings,
    composite: null,
    selectedNodeIds,
  };
}

describe('BuilderHistoryStack', () => {
  it('records undo entries and clears redo on new mutations', () => {
    const history = new BuilderHistoryStack();
    const empty = makeGraphSnapshot([], [], []);
    const withNode = makeGraphSnapshot([{ id: 'n1' } as ComponentNode], [], ['n1']);

    history.record(empty);
    const restored = history.undo(withNode);
    expect(restored?.nodes).toHaveLength(0);
    expect(history.canRedo).toBe(true);

    history.record(makeGraphSnapshot([{ id: 'n2' } as ComponentNode], [], ['n2']));
    expect(history.canRedo).toBe(false);
  });

  it('redoes the last undone snapshot', () => {
    const history = new BuilderHistoryStack();
    const empty = makeGraphSnapshot([], [], []);
    const withNode = makeGraphSnapshot([{ id: 'n1' } as ComponentNode], [], ['n1']);

    history.record(empty);
    const undone = history.undo(withNode);
    expect(undone?.nodes).toHaveLength(0);

    const redone = history.redo(empty);
    expect(redone?.nodes).toHaveLength(1);
    expect(redone?.nodes[0]?.id).toBe('n1');
  });

  it('coalesces drag/resize into a single undo via transactions', () => {
    const history = new BuilderHistoryStack();
    const before = makeGraphSnapshot([], [], []);
    const midDrag = makeGraphSnapshot([
      { id: 'n1', layout: { x: 32, y: 32, width: 220, height: 72 } } as ComponentNode,
    ]);

    history.beginTransaction(before);
    history.beginTransaction(before);
    history.commitTransaction();

    expect(history.canUndo).toBe(true);
    const restored = history.undo(midDrag);
    expect(restored?.nodes).toHaveLength(0);
  });

  it('deep-clones snapshots', () => {
    const original: BuilderGraphSnapshot = {
      nodes: [{
        id: 'n1',
        type: 'visual.kpi',
        label: 'KPI',
        properties: {},
        ports: { inputs: [], outputs: [] },
      }],
      bindings: [],
      composite: { id: 'c1', name: 'Main', nodes: [], bindings: [], version: 1 } as Composite,
      selectedNodeIds: ['n1'],
    };
    const clone = cloneBuilderGraphSnapshot(original);
    const firstNode = clone.nodes[0];
    if (firstNode) {
      firstNode.label = 'Changed';
    }
    expect(original.nodes[0]?.label).toBe('KPI');
  });
});
