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

  it('shows children when currentRole is allowed', () => {
    render(
      <RoleGate currentRole="admin" allowedRoles={['admin', 'editor']}>
        <p>Secret panel</p>
      </RoleGate>,
    );
    expect(screen.getByTestId('rd-role-gate-visible')).toBeTruthy();
    expect(screen.getByText('Secret panel')).toBeTruthy();
  });

  it('hides children when currentRole is not allowed', () => {
    render(
      <RoleGate currentRole="viewer" allowedRoles={['admin']} hiddenStatusText="No access">
        <p>Secret panel</p>
      </RoleGate>,
    );
    expect(screen.getByTestId('rd-role-gate-hidden').textContent).toContain('No access');
    expect(screen.queryByText('Secret panel')).toBeNull();
  });
});
