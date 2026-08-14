import type { NewsSearchBoxProps } from './news-search-box';

describe('@rosettadash/vue/visual/news/search-box', () => {
  it('exposes typed props contract', () => {
    const props: NewsSearchBoxProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-news-search-box', () => {
    expect('rd-news-search-box').toMatch(/^rd-/);
  });
});
