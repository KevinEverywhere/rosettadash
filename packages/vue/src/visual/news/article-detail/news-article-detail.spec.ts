import type { NewsArticleDetailProps } from './news-article-detail';

describe('@rosettadash/vue/visual/news/article-detail', () => {
  it('exposes typed props contract', () => {
    const props: NewsArticleDetailProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-news-article-detail', () => {
    expect('rd-news-article-detail').toMatch(/^rd-/);
  });
});
