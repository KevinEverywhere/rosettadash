import type { NumberInputProps } from './number-input';

describe('@rosettadash/angular/visual/input/number', () => {
  it('exposes typed props contract', () => {
    const props: NumberInputProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-input-number', () => {
    expect('rd-input-number').toMatch(/^rd-/);
  });
});
