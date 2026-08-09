import type { Binding, ComponentNode } from '../model/types';

export type DefaultsTrigger =
  | { type: 'nodeAdded'; nodeId: string }
  | { type: 'bindingCreated'; bindingId: string };

export interface DefaultPropertyPatch {
  key: string;
  value: unknown;
}

export interface DefaultSuggestion {
  id: string;
  nodeId: string;
  kind: 'hint' | 'patch';
  title: string;
  message: string;
  patches?: DefaultPropertyPatch[];
}

export interface DefaultsContext {
  nodes: ComponentNode[];
  bindings: Binding[];
}

export interface EvaluateDefaultsOptions {
  dismissedIds?: Set<string>;
}
