import type { Binding, Composite } from '../model/types';

export type ExportScope = 'full' | 'single' | 'selection';

export interface ResolveExportScopeOptions {
  scope: ExportScope;
  seedNodeIds?: string[];
}

export function resolveExportComposite(
  composite: Composite,
  options: ResolveExportScopeOptions,
): Composite {
  const { scope, seedNodeIds = [] } = options;

  if (scope === 'full') {
    return composite;
  }

  const seeds = seedNodeIds.filter((id) => composite.nodes.some((node) => node.id === id));
  if (seeds.length === 0) {
    return { ...composite, nodes: [], bindings: [] };
  }

  const included = new Set<string>();

  if (scope === 'single') {
    for (const seed of seeds) {
      included.add(seed);
    }
    expandUpstreamBindings(composite.bindings, included);
  } else {
    expandBindingNeighborhood(composite.bindings, seeds, included);
  }

  return {
    ...composite,
    nodes: composite.nodes.filter((node) => included.has(node.id)),
    bindings: composite.bindings.filter(
      (binding) =>
        included.has(binding.sourceNodeId) && included.has(binding.targetNodeId),
    ),
  };
}

function expandUpstreamBindings(bindings: Binding[], included: Set<string>): void {
  let changed = true;
  while (changed) {
    changed = false;
    for (const binding of bindings) {
      if (included.has(binding.targetNodeId) && !included.has(binding.sourceNodeId)) {
        included.add(binding.sourceNodeId);
        changed = true;
      }
    }
  }
}

function expandBindingNeighborhood(
  bindings: Binding[],
  seeds: string[],
  included: Set<string>,
): void {
  const queue = [...seeds];

  for (const seed of seeds) {
    included.add(seed);
  }

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    for (const binding of bindings) {
      const neighbor = neighborNodeId(binding, current);
      if (neighbor && !included.has(neighbor)) {
        included.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

function neighborNodeId(binding: Binding, nodeId: string): string | null {
  if (binding.sourceNodeId === nodeId) {
    return binding.targetNodeId;
  }
  if (binding.targetNodeId === nodeId) {
    return binding.sourceNodeId;
  }
  return null;
}
