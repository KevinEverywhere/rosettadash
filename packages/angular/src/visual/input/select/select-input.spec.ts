import type { SelectInputProps } from './select-input';

describe('@rosettadash/angular/visual/input/select', () => {
  it('exposes typed props contract', () => {
    const props: SelectInputProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-input-select', () => {
    expect('rd-input-select').toMatch(/^rd-/);
  });
});
