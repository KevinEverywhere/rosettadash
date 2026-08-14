import { render, screen } from '@testing-library/react';
import { JourneySankeyChart } from './JourneySankeyChart.js';

describe('JourneySankeyChart', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<JourneySankeyChart />);
    expect(screen.getByTestId('rd-chart-sankey')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<JourneySankeyChart ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
