import { render, screen } from '@testing-library/react';
import { PersonInvite } from './PersonInvite.js';

describe('PersonInvite', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<PersonInvite />);
    expect(screen.getByTestId('rd-person-invite')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<PersonInvite ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
