import { render, screen } from '@testing-library/react';
import { LineChart } from './LineChart.js';

describe('LineChart', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<LineChart />);
    expect(screen.getByTestId('rd-chart-line')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<LineChart ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
