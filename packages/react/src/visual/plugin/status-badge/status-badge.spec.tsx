import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge.js';

describe('StatusBadge', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<StatusBadge />);
    expect(screen.getByTestId('rd-plugin-status-badge')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<StatusBadge ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
