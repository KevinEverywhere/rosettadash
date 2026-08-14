import { render, screen } from '@testing-library/react';
import { NewsRegionSelect } from './NewsRegionSelect.js';

describe('NewsRegionSelect', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<NewsRegionSelect />);
    expect(screen.getByTestId('rd-news-region-select')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<NewsRegionSelect ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
