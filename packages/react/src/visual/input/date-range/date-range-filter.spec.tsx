import { render, screen } from '@testing-library/react';
import { DateRangeFilter } from './DateRangeFilter.js';

describe('DateRangeFilter', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<DateRangeFilter />);
    expect(screen.getByTestId('rd-input-date-range')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<DateRangeFilter ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
