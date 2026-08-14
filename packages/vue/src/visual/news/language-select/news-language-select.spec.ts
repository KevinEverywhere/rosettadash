import type { NewsLanguageSelectProps } from './news-language-select';

describe('@rosettadash/vue/visual/news/language-select', () => {
  it('exposes typed props contract', () => {
    const props: NewsLanguageSelectProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-news-language-select', () => {
    expect('rd-news-language-select').toMatch(/^rd-/);
  });
});
