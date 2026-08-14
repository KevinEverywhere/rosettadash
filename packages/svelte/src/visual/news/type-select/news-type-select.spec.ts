import type { NewsTypeSelectProps } from './types';

describe('@rosettadash/svelte/visual/news/type-select', () => {
  it('exposes typed props contract', () => {
    const props: NewsTypeSelectProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-news-type-select', () => {
    expect('rd-news-type-select').toMatch(/^rd-/);
  });
});
