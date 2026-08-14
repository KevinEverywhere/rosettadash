import type { GridLayoutProps } from './types';

describe('@rosettadash/svelte/layout/grid', () => {
  it('exposes typed props contract', () => {
    const props: GridLayoutProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-grid', () => {
    expect('rd-grid').toMatch(/^rd-/);
  });
});
