import { defaultComponentRegistry } from '../registry/component-registry';
import { validateAiBuilderActions } from './validate-actions';

describe('validateAiBuilderActions', () => {
  it('accepts add_node for a known type', () => {
    const result = validateAiBuilderActions(
      [{ op: 'add_node', type: 'visual.table', ref: 'table1' }],
      defaultComponentRegistry,
      [],
    );
    expect(result.valid).toBe(true);
    expect(result.applicableActions).toHaveLength(1);
  });

  it('rejects unknown component types', () => {
    const result = validateAiBuilderActions(
      [{ op: 'add_node', type: 'not.real' }],
      defaultComponentRegistry,
      [],
    );
    expect(result.valid).toBe(false);
    expect(result.issues[0]?.message).toContain('Unknown component type');
  });
});
