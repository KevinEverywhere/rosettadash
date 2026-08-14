import { render, screen } from '@testing-library/react';
import { GridLayout } from './GridLayout.js';

describe('GridLayout', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<GridLayout />);
    expect(screen.getByTestId('rd-grid')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<GridLayout ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
