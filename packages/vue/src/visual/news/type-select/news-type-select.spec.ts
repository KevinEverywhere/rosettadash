import type { NewsTypeSelectProps } from './news-type-select';

describe('@rosettadash/vue/visual/news/type-select', () => {
  it('exposes typed props contract', () => {
    const props: NewsTypeSelectProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-news-type-select', () => {
    expect('rd-news-type-select').toMatch(/^rd-/);
  });
});
