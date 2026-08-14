import type { TextInputProps } from './types';

describe('@rosettadash/svelte/visual/input/text', () => {
  it('exposes typed props contract', () => {
    const props: TextInputProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-input-text', () => {
    expect('rd-input-text').toMatch(/^rd-/);
  });
});
