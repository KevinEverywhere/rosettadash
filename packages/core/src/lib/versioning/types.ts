export interface CompositeVersionSummary {
  version: number;
  savedAt: string;
  nodeCount: number;
  bindingCount: number;
}

export interface CompositeDiffSummary {
  nodesAdded: number;
  nodesRemoved: number;
  nodesModified: number;
  bindingsAdded: number;
  bindingsRemoved: number;
  bindingsModified: number;
  metadataChanged: boolean;
}

export type CompositeDiffChange =
  | { kind: 'node-added'; nodeId: string; nodeType: string; label: string }
  | { kind: 'node-removed'; nodeId: string; nodeType: string; label: string }
  | { kind: 'node-modified'; nodeId: string; label: string; fields: string[] }
  | { kind: 'binding-added'; bindingId: string; sourceNodeId: string; targetNodeId: string }
  | { kind: 'binding-removed'; bindingId: string; sourceNodeId: string; targetNodeId: string }
  | { kind: 'binding-modified'; bindingId: string; fields: string[] }
  | { kind: 'metadata-changed'; fields: string[] };

export interface CompositeDiff {
  fromVersion: number;
  toVersion: number;
  summary: CompositeDiffSummary;
  changes: CompositeDiffChange[];
}

export interface CompositeRevision {
  version: number;
  savedAt: string;
  composite: import('../model/types').Composite;
}
