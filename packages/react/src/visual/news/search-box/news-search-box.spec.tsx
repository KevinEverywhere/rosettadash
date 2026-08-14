import { render, screen } from '@testing-library/react';
import { NewsSearchBox } from './NewsSearchBox.js';

describe('NewsSearchBox', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<NewsSearchBox />);
    expect(screen.getByTestId('rd-news-search-box')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<NewsSearchBox ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
