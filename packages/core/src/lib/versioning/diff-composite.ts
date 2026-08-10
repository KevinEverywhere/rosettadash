import type { Binding, ComponentNode, Composite } from '../model/types';
import type { CompositeDiff, CompositeDiffChange, CompositeDiffSummary } from './types';

function stableJson(value: unknown): string {
  return JSON.stringify(value);
}

function nodeFieldsChanged(before: ComponentNode, after: ComponentNode): string[] {
  const fields: string[] = [];
  if (before.type !== after.type) {
    fields.push('type');
  }
  if (before.label !== after.label) {
    fields.push('label');
  }
  if (stableJson(before.properties) !== stableJson(after.properties)) {
    fields.push('properties');
  }
  if (stableJson(before.layout) !== stableJson(after.layout)) {
    fields.push('layout');
  }
  if (stableJson(before.ports) !== stableJson(after.ports)) {
    fields.push('ports');
  }
  return fields;
}

function bindingFieldsChanged(before: Binding, after: Binding): string[] {
  const fields: string[] = [];
  if (before.sourceNodeId !== after.sourceNodeId) {
    fields.push('sourceNodeId');
  }
  if (before.sourcePortId !== after.sourcePortId) {
    fields.push('sourcePortId');
  }
  if (before.targetNodeId !== after.targetNodeId) {
    fields.push('targetNodeId');
  }
  if (before.targetPortId !== after.targetPortId) {
    fields.push('targetPortId');
  }
  return fields;
}

function summarizeChanges(changes: CompositeDiffChange[]): CompositeDiffSummary {
  return {
    nodesAdded: changes.filter((change) => change.kind === 'node-added').length,
    nodesRemoved: changes.filter((change) => change.kind === 'node-removed').length,
    nodesModified: changes.filter((change) => change.kind === 'node-modified').length,
    bindingsAdded: changes.filter((change) => change.kind === 'binding-added').length,
    bindingsRemoved: changes.filter((change) => change.kind === 'binding-removed').length,
    bindingsModified: changes.filter((change) => change.kind === 'binding-modified').length,
    metadataChanged: changes.some((change) => change.kind === 'metadata-changed'),
  };
}

export function diffComposite(from: Composite, to: Composite): CompositeDiff {
  const changes: CompositeDiffChange[] = [];

  const metadataFields: string[] = [];
  if (from.name !== to.name) {
    metadataFields.push('name');
  }
  if (from.description !== to.description) {
    metadataFields.push('description');
  }
  if (from.templateId !== to.templateId) {
    metadataFields.push('templateId');
  }
  if (stableJson(from.domainContext) !== stableJson(to.domainContext)) {
    metadataFields.push('domainContext');
  }
  if (stableJson(from.exportTargets) !== stableJson(to.exportTargets)) {
    metadataFields.push('exportTargets');
  }
  if (metadataFields.length > 0) {
    changes.push({ kind: 'metadata-changed', fields: metadataFields });
  }

  const fromNodes = new Map(from.nodes.map((node) => [node.id, node]));
  const toNodes = new Map(to.nodes.map((node) => [node.id, node]));

  for (const [nodeId, node] of toNodes) {
    if (!fromNodes.has(nodeId)) {
      changes.push({
        kind: 'node-added',
        nodeId,
        nodeType: node.type,
        label: node.label,
      });
    }
  }

  for (const [nodeId, node] of fromNodes) {
    if (!toNodes.has(nodeId)) {
      changes.push({
        kind: 'node-removed',
        nodeId,
        nodeType: node.type,
        label: node.label,
      });
    }
  }

  for (const [nodeId, after] of toNodes) {
    const before = fromNodes.get(nodeId);
    if (!before) {
      continue;
    }
    const fields = nodeFieldsChanged(before, after);
    if (fields.length > 0) {
      changes.push({
        kind: 'node-modified',
        nodeId,
        label: after.label,
        fields,
      });
    }
  }

  const fromBindings = new Map(from.bindings.map((binding) => [binding.id, binding]));
  const toBindings = new Map(to.bindings.map((binding) => [binding.id, binding]));

  for (const [bindingId, binding] of toBindings) {
    if (!fromBindings.has(bindingId)) {
      changes.push({
        kind: 'binding-added',
        bindingId,
        sourceNodeId: binding.sourceNodeId,
        targetNodeId: binding.targetNodeId,
      });
    }
  }

  for (const [bindingId, binding] of fromBindings) {
    if (!toBindings.has(bindingId)) {
      changes.push({
        kind: 'binding-removed',
        bindingId,
        sourceNodeId: binding.sourceNodeId,
        targetNodeId: binding.targetNodeId,
      });
    }
  }

  for (const [bindingId, after] of toBindings) {
    const before = fromBindings.get(bindingId);
    if (!before) {
      continue;
    }
    const fields = bindingFieldsChanged(before, after);
    if (fields.length > 0) {
      changes.push({
        kind: 'binding-modified',
        bindingId,
        fields,
      });
    }
  }

  return {
    fromVersion: from.version,
    toVersion: to.version,
    summary: summarizeChanges(changes),
    changes,
  };
}
