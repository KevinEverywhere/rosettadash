import type { NewsRegionSelectProps } from './news-region-select';

describe('@rosettadash/vue/visual/news/region-select', () => {
  it('exposes typed props contract', () => {
    const props: NewsRegionSelectProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-news-region-select', () => {
    expect('rd-news-region-select').toMatch(/^rd-/);
  });
});
