import { render, screen } from '@testing-library/react';
import { Timer } from './Timer.js';

describe('Timer', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<Timer />);
    expect(screen.getByTestId('rd-timer')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<Timer ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
