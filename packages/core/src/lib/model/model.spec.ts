import { ComponentRegistry } from '../registry/component-registry';
import { validateComposite } from '../validation/validate-composite';
import type { Composite, ValidationIssue } from './types';

describe('ComponentRegistry', () => {
  const registry = new ComponentRegistry();

  it('registers P0 component types', () => {
    expect(registry.list().length).toBeGreaterThanOrEqual(10);
    expect(registry.get('visual.table')).toBeDefined();
    expect(registry.get('infra.postgresql')).toBeDefined();
  });

  it('creates nodes with default properties and ports', () => {
    const node = registry.createNode('visual.table', { id: 'table-1' });

    expect(node.id).toBe('table-1');
    expect(node.type).toBe('visual.table');
    expect(node.properties['pageSize']).toBe(25);
    expect(node.ports.inputs.some((p) => p.id === 'data')).toBe(true);
  });

  it('throws for unknown types', () => {
    expect(() => registry.createNode('unknown.type')).toThrow(/Unknown component type/);
  });
});

describe('validateComposite', () => {
  const registry = new ComponentRegistry();

  it('passes a valid minimal composite', () => {
    const composite: Composite = {
      id: 'c1',
      name: 'Dashboard',
      nodes: [
        registry.createNode('visual.input.text', { id: 'input-1' }),
      ],
      bindings: [],
      version: 1,
    };

    const result = validateComposite(composite, registry);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('validates P1 form input nodes', () => {
    const composite: Composite = {
      id: 'c1',
      name: 'Form',
      nodes: [
        registry.createNode('visual.input.number', { id: 'num-1' }),
        registry.createNode('visual.input.checkbox', { id: 'chk-1' }),
        registry.createNode('visual.input.textarea', { id: 'area-1' }),
      ],
      bindings: [],
      version: 1,
    };

    const result = validateComposite(composite, registry);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('flags unbound required inputs', () => {
    const composite: Composite = {
      id: 'c1',
      name: 'Dashboard',
      nodes: [
        registry.createNode('visual.table', { id: 'table-1' }),
      ],
      bindings: [],
      version: 1,
    };

    const result = validateComposite(composite, registry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i: ValidationIssue) => i.code === 'UNBOUND_REQUIRED_PORT')).toBe(true);
  });

  it('flags incompatible port bindings', () => {
    const composite: Composite = {
      id: 'c1',
      name: 'Dashboard',
      nodes: [
        registry.createNode('visual.input.text', { id: 'input-1' }),
        registry.createNode('visual.table', { id: 'table-1' }),
      ],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'input-1',
          sourcePortId: 'value',
          targetNodeId: 'table-1',
          targetPortId: 'data',
        },
      ],
      version: 1,
    };

    const result = validateComposite(composite, registry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i: ValidationIssue) => i.code === 'INCOMPATIBLE_PORT_TYPES')).toBe(true);
  });

  it('accepts compatible bindings', () => {
    const db = registry.createNode('infra.postgresql', {
      id: 'db-1',
      properties: { connectionEnvKey: 'DATABASE_URL', table: 'orders' },
    });
    const table = registry.createNode('visual.table', { id: 'table-1' });

    const composite: Composite = {
      id: 'c1',
      name: 'Orders',
      nodes: [db, table],
      bindings: [
        {
          id: 'b1',
          sourceNodeId: 'db-1',
          sourcePortId: 'rowset',
          targetNodeId: 'table-1',
          targetPortId: 'data',
        },
      ],
      version: 1,
    };

    const result = validateComposite(composite, registry);
    expect(result.valid).toBe(true);
  });

  it('allows unbound required ports in draft mode', () => {
    const composite: Composite = {
      id: 'c1',
      name: 'Dashboard',
      nodes: [
        registry.createNode('visual.table', { id: 'table-1' }),
      ],
      bindings: [],
      version: 1,
    };

    const draft = validateComposite(composite, registry, { mode: 'draft' });
    const strict = validateComposite(composite, registry, { mode: 'strict' });

    expect(draft.valid).toBe(true);
    expect(strict.valid).toBe(false);
  });
});
