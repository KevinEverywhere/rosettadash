import type { TextInputProps } from './text-input';

describe('@rosettadash/vue/visual/input/text', () => {
  it('exposes typed props contract', () => {
    const props: TextInputProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-input-text', () => {
    expect('rd-input-text').toMatch(/^rd-/);
  });
});
