import { render, screen } from '@testing-library/react';
import { NewsResultsTable } from './NewsResultsTable.js';

describe('NewsResultsTable', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<NewsResultsTable />);
    expect(screen.getByTestId('rd-news-results-table')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<NewsResultsTable ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
