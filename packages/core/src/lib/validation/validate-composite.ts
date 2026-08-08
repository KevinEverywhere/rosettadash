import { areDataTypesCompatible } from '../model/data-types';
import type { Binding, Composite, ValidationIssue, ValidationResult } from '../model/types';
import type { ComponentRegistry } from '../registry/component-registry';
import { validateNode } from './validate-node';

export function validateComposite(
  composite: Composite,
  registry: ComponentRegistry,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!composite.name?.trim()) {
    issues.push({
      code: 'MISSING_COMPOSITE_NAME',
      message: 'Composite name is required',
    });
  }

  const nodeIds = new Set<string>();
  for (const node of composite.nodes) {
    if (nodeIds.has(node.id)) {
      issues.push({
        code: 'DUPLICATE_NODE_ID',
        message: `Duplicate node id "${node.id}"`,
        nodeId: node.id,
      });
    }
    nodeIds.add(node.id);
    issues.push(...validateNode(node, registry));
  }

  const bindingIds = new Set<string>();
  for (const binding of composite.bindings) {
    if (bindingIds.has(binding.id)) {
      issues.push({
        code: 'DUPLICATE_BINDING_ID',
        message: `Duplicate binding id "${binding.id}"`,
        bindingId: binding.id,
      });
    }
    bindingIds.add(binding.id);
    issues.push(...validateBinding(binding, composite, registry));
  }

  issues.push(...detectDataCycles(composite));

  const boundRequiredInputs = findBoundRequiredInputs(composite);
  for (const node of composite.nodes) {
    const definition = registry.get(node.type);
    if (!definition) {
      continue;
    }
    for (const input of definition.inputs) {
      if (!input.required) {
        continue;
      }
      const key = `${node.id}:${input.id}`;
      if (!boundRequiredInputs.has(key)) {
        issues.push({
          code: 'UNBOUND_REQUIRED_PORT',
          message: `Required input "${input.name}" on "${node.label}" is not bound`,
          nodeId: node.id,
          path: `ports.inputs.${input.id}`,
        });
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function validateBinding(
  binding: Binding,
  composite: Composite,
  registry: ComponentRegistry,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const sourceNode = composite.nodes.find((n) => n.id === binding.sourceNodeId);
  const targetNode = composite.nodes.find((n) => n.id === binding.targetNodeId);

  if (!sourceNode) {
    issues.push({
      code: 'BINDING_SOURCE_NOT_FOUND',
      message: `Binding source node "${binding.sourceNodeId}" not found`,
      bindingId: binding.id,
    });
    return issues;
  }

  if (!targetNode) {
    issues.push({
      code: 'BINDING_TARGET_NOT_FOUND',
      message: `Binding target node "${binding.targetNodeId}" not found`,
      bindingId: binding.id,
    });
    return issues;
  }

  const sourcePort = registry.findPort(sourceNode, binding.sourcePortId, 'output');
  const targetPort = registry.findPort(targetNode, binding.targetPortId, 'input');

  if (!sourcePort) {
    issues.push({
      code: 'BINDING_SOURCE_PORT_NOT_FOUND',
      message: `Output port "${binding.sourcePortId}" not found on "${sourceNode.label}"`,
      bindingId: binding.id,
      nodeId: sourceNode.id,
    });
  }

  if (!targetPort) {
    issues.push({
      code: 'BINDING_TARGET_PORT_NOT_FOUND',
      message: `Input port "${binding.targetPortId}" not found on "${targetNode.label}"`,
      bindingId: binding.id,
      nodeId: targetNode.id,
    });
  }

  if (sourcePort && targetPort && !areDataTypesCompatible(sourcePort.dataType, targetPort.dataType)) {
    issues.push({
      code: 'INCOMPATIBLE_PORT_TYPES',
      message: `Cannot bind ${sourcePort.dataType} to ${targetPort.dataType} (${sourceNode.label} → ${targetNode.label})`,
      bindingId: binding.id,
    });
  }

  return issues;
}

function findBoundRequiredInputs(composite: Composite): Set<string> {
  const bound = new Set<string>();
  for (const binding of composite.bindings) {
    bound.add(`${binding.targetNodeId}:${binding.targetPortId}`);
  }
  return bound;
}

function detectDataCycles(composite: Composite): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const adjacency = new Map<string, string[]>();

  for (const binding of composite.bindings) {
    const list = adjacency.get(binding.sourceNodeId) ?? [];
    list.push(binding.targetNodeId);
    adjacency.set(binding.sourceNodeId, list);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function dfs(nodeId: string): boolean {
    if (visiting.has(nodeId)) {
      return true;
    }
    if (visited.has(nodeId)) {
      return false;
    }
    visiting.add(nodeId);
    for (const next of adjacency.get(nodeId) ?? []) {
      if (dfs(next)) {
        issues.push({
          code: 'DATA_CYCLE',
          message: 'Data-flow cycle detected in composite bindings',
        });
        return true;
      }
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  }

  for (const node of composite.nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  }

  return issues;
}
