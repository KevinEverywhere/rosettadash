import type { ComponentRegistry } from '../registry/component-registry';
import type { ComponentNode, ValidationIssue } from '../model/types';

export function validateNode(
  node: ComponentNode,
  registry: ComponentRegistry,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const definition = registry.get(node.type);

  if (!definition) {
    issues.push({
      code: 'UNKNOWN_COMPONENT_TYPE',
      message: `Unknown component type "${node.type}"`,
      nodeId: node.id,
    });
    return issues;
  }

  if (!node.label?.trim()) {
    issues.push({
      code: 'MISSING_LABEL',
      message: 'Node label is required',
      nodeId: node.id,
    });
  }

  for (const schema of definition.properties) {
    if (!schema.required) {
      continue;
    }
    const value = node.properties[schema.key];
    if (value === undefined || value === null || value === '') {
      issues.push({
        code: 'MISSING_REQUIRED_PROPERTY',
        message: `Property "${schema.label}" is required`,
        nodeId: node.id,
        path: `properties.${schema.key}`,
      });
    }
  }

  for (const schema of definition.properties) {
    const value = node.properties[schema.key];
    if (value === undefined) {
      continue;
    }
    if (schema.type === 'number' && typeof value !== 'number') {
      issues.push({
        code: 'INVALID_PROPERTY_TYPE',
        message: `Property "${schema.label}" must be a number`,
        nodeId: node.id,
        path: `properties.${schema.key}`,
      });
    }
    if (schema.type === 'boolean' && typeof value !== 'boolean') {
      issues.push({
        code: 'INVALID_PROPERTY_TYPE',
        message: `Property "${schema.label}" must be a boolean`,
        nodeId: node.id,
        path: `properties.${schema.key}`,
      });
    }
    if (schema.type === 'string' && typeof value !== 'string') {
      issues.push({
        code: 'INVALID_PROPERTY_TYPE',
        message: `Property "${schema.label}" must be a string`,
        nodeId: node.id,
        path: `properties.${schema.key}`,
      });
    }
  }

  return issues;
}
