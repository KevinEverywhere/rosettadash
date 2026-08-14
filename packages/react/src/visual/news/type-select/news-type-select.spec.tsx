import { render, screen } from '@testing-library/react';
import { NewsTypeSelect } from './NewsTypeSelect.js';

describe('NewsTypeSelect', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<NewsTypeSelect />);
    expect(screen.getByTestId('rd-news-type-select')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<NewsTypeSelect ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
