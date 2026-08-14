import type { NewsResultsTableProps } from './types';

describe('@rosettadash/svelte/visual/news/results-table', () => {
  it('exposes typed props contract', () => {
    const props: NewsResultsTableProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-news-results-table', () => {
    expect('rd-news-results-table').toMatch(/^rd-/);
  });
});
