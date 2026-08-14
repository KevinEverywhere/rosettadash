import { render, screen } from '@testing-library/react';
import { RoleGate } from './RoleGate.js';

describe('RoleGate', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<RoleGate />);
    expect(screen.getByTestId('rd-role-gate')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<RoleGate ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
