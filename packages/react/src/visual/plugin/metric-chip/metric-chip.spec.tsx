import { render, screen } from '@testing-library/react';
import { MetricChip } from './MetricChip.js';

describe('MetricChip', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<MetricChip />);
    expect(screen.getByTestId('rd-plugin-metric-chip')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<MetricChip ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
