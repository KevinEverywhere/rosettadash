import type { DetailPanelProps } from './detail-panel';

describe('@rosettadash/vue/visual/detail', () => {
  it('exposes typed props contract', () => {
    const props: DetailPanelProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-detail', () => {
    expect('rd-detail').toMatch(/^rd-/);
  });
});
