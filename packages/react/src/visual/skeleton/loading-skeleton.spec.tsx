import { render, screen } from '@testing-library/react';
import { LoadingSkeleton } from './LoadingSkeleton.js';

describe('LoadingSkeleton', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<LoadingSkeleton />);
    expect(screen.getByTestId('rd-skeleton')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<LoadingSkeleton ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
