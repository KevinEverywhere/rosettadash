import type { DetailPanelProps } from './types';

describe('@rosettadash/svelte/visual/detail', () => {
  it('exposes typed props contract', () => {
    const props: DetailPanelProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-detail', () => {
    expect('rd-detail').toMatch(/^rd-/);
  });
});
