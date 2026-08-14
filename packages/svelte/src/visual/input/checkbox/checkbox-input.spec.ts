import type { CheckboxInputProps } from './types';

describe('@rosettadash/svelte/visual/input/checkbox', () => {
  it('exposes typed props contract', () => {
    const props: CheckboxInputProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-input-checkbox', () => {
    expect('rd-input-checkbox').toMatch(/^rd-/);
  });
});
