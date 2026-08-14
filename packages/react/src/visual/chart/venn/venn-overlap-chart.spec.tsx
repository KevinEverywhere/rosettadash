import { render, screen } from '@testing-library/react';
import { VennOverlapChart } from './VennOverlapChart.js';

describe('VennOverlapChart', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<VennOverlapChart />);
    expect(screen.getByTestId('rd-chart-venn')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<VennOverlapChart ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
