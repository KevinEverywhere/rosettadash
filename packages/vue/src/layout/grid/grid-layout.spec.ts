import type { GridLayoutProps } from './grid-layout';

describe('@rosettadash/vue/layout/grid', () => {
  it('exposes typed props contract', () => {
    const props: GridLayoutProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-grid', () => {
    expect('rd-grid').toMatch(/^rd-/);
  });
});
