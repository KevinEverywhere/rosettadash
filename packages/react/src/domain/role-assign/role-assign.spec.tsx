import { render, screen } from '@testing-library/react';
import { RoleAssign } from './RoleAssign.js';

describe('RoleAssign', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<RoleAssign />);
    expect(screen.getByTestId('rd-role-assign')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<RoleAssign ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
