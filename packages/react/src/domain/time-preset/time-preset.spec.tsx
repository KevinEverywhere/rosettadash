import { render, screen } from '@testing-library/react';
import { TimePreset } from './TimePreset.js';

describe('TimePreset', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<TimePreset />);
    expect(screen.getByTestId('rd-time-preset')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<TimePreset ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
