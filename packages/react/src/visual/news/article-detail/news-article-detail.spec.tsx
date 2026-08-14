import { render, screen } from '@testing-library/react';
import { NewsArticleDetail } from './NewsArticleDetail.js';

describe('NewsArticleDetail', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<NewsArticleDetail />);
    expect(screen.getByTestId('rd-news-article-detail')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<NewsArticleDetail ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
