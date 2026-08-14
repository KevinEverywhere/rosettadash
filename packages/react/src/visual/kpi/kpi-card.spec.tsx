import { render, screen } from '@testing-library/react';
import { KpiCard } from './KpiCard.js';

describe('KpiCard', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<KpiCard />);
    expect(screen.getByTestId('rd-kpi')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<KpiCard ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
