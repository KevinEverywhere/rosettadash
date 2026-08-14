import { render, screen } from '@testing-library/react';
import { ThreeBarChart } from './ThreeBarChart.js';

describe('ThreeBarChart', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<ThreeBarChart />);
    expect(screen.getByTestId('rd-display-3d-bar-chart')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<ThreeBarChart ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
