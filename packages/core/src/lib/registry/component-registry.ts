import type { ComponentDefinition, ComponentNode, Port } from '../model/types';
import { P0_COMPONENT_DEFINITIONS } from './p0-components';

export class ComponentRegistry {
  private readonly definitions = new Map<string, ComponentDefinition>();

  constructor(definitions: ComponentDefinition[] = P0_COMPONENT_DEFINITIONS) {
    for (const definition of definitions) {
      this.register(definition);
    }
  }

  register(definition: ComponentDefinition): void {
    if (this.definitions.has(definition.type)) {
      throw new Error(`Component type already registered: ${definition.type}`);
    }
    this.definitions.set(definition.type, definition);
  }

  get(type: string): ComponentDefinition | undefined {
    return this.definitions.get(type);
  }

  getOrThrow(type: string): ComponentDefinition {
    const definition = this.get(type);
    if (!definition) {
      throw new Error(`Unknown component type: ${type}`);
    }
    return definition;
  }

  list(): ComponentDefinition[] {
    return [...this.definitions.values()].sort((a, b) => a.label.localeCompare(b.label));
  }

  listByCategory(category: ComponentDefinition['category']): ComponentDefinition[] {
    return this.list().filter((d) => d.category === category);
  }

  createNode(type: string, overrides: Partial<Pick<ComponentNode, 'id' | 'label' | 'properties' | 'layout'>> = {}): ComponentNode {
    const definition = this.getOrThrow(type);
    const properties = this.defaultProperties(definition);

    return {
      id: overrides.id ?? crypto.randomUUID(),
      type: definition.type,
      label: overrides.label ?? definition.label,
      properties: { ...properties, ...overrides.properties },
      ports: {
        inputs: definition.inputs.map((p) => ({ ...p })),
        outputs: definition.outputs.map((p) => ({ ...p })),
      },
      layout: overrides.layout,
      meta: { suggestedBy: 'user' },
    };
  }

  defaultProperties(definition: ComponentDefinition): Record<string, unknown> {
    const properties: Record<string, unknown> = {};
    for (const schema of definition.properties) {
      if (schema.default !== undefined) {
        properties[schema.key] = schema.default;
      }
    }
    return properties;
  }

  findPort(node: ComponentNode, portId: string, direction: 'input' | 'output'): Port | undefined {
    const ports = direction === 'input' ? node.ports.inputs : node.ports.outputs;
    return ports.find((p) => p.id === portId);
  }
}

export const defaultComponentRegistry = new ComponentRegistry();
