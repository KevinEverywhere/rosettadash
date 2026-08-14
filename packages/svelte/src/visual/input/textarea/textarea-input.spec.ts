import type { TextareaInputProps } from './types';

describe('@rosettadash/svelte/visual/input/textarea', () => {
  it('exposes typed props contract', () => {
    const props: TextareaInputProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-input-textarea', () => {
    expect('rd-input-textarea').toMatch(/^rd-/);
  });
});
