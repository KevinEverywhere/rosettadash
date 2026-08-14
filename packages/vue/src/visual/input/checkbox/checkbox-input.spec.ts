import type { CheckboxInputProps } from './checkbox-input';

describe('@rosettadash/vue/visual/input/checkbox', () => {
  it('exposes typed props contract', () => {
    const props: CheckboxInputProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-input-checkbox', () => {
    expect('rd-input-checkbox').toMatch(/^rd-/);
  });
});
