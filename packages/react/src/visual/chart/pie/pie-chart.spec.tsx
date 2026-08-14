import { render, screen } from '@testing-library/react';
import { PieChart } from './PieChart.js';

describe('PieChart', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<PieChart />);
    expect(screen.getByTestId('rd-chart-pie')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<PieChart ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
