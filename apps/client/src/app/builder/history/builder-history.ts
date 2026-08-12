import type { Binding, ComponentNode, Composite } from '@rosettadash/core';

export interface BuilderGraphSnapshot {
  nodes: ComponentNode[];
  bindings: Binding[];
  composite: Composite | null;
  selectedNodeIds: string[];
}

export function cloneBuilderGraphSnapshot(
  snapshot: BuilderGraphSnapshot,
): BuilderGraphSnapshot {
  return structuredClone(snapshot);
}

export class BuilderHistoryStack {
  private undoStack: BuilderGraphSnapshot[] = [];
  private redoStack: BuilderGraphSnapshot[] = [];
  private pendingTransaction: BuilderGraphSnapshot | null = null;

  constructor(private readonly maxDepth = 50) {}

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.pendingTransaction = null;
  }

  /** Push a snapshot onto the undo stack and clear redo (call before a mutation). */
  record(snapshot: BuilderGraphSnapshot): void {
    this.undoStack.push(cloneBuilderGraphSnapshot(snapshot));
    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  /** Begin a coalesced transaction (e.g. drag/resize) — only the pre-drag state is recorded once. */
  beginTransaction(snapshot: BuilderGraphSnapshot): void {
    if (!this.pendingTransaction) {
      this.pendingTransaction = cloneBuilderGraphSnapshot(snapshot);
    }
  }

  commitTransaction(): void {
    if (!this.pendingTransaction) {
      return;
    }
    this.record(this.pendingTransaction);
    this.pendingTransaction = null;
  }

  cancelTransaction(): void {
    this.pendingTransaction = null;
  }

  undo(current: BuilderGraphSnapshot): BuilderGraphSnapshot | null {
    const previous = this.undoStack.pop();
    if (!previous) {
      return null;
    }
    this.redoStack.push(cloneBuilderGraphSnapshot(current));
    return previous;
  }

  redo(current: BuilderGraphSnapshot): BuilderGraphSnapshot | null {
    const next = this.redoStack.pop();
    if (!next) {
      return null;
    }
    this.undoStack.push(cloneBuilderGraphSnapshot(current));
    return next;
  }
}
