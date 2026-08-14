import { render, screen } from '@testing-library/react';
import { ThreeScatterPlot } from './ThreeScatterPlot.js';

describe('ThreeScatterPlot', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<ThreeScatterPlot />);
    expect(screen.getByTestId('rd-display-3d-scatter')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<ThreeScatterPlot ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
