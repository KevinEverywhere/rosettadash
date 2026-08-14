import { render, screen } from '@testing-library/react';
import { NextServerInfra } from './NextServerInfra.js';

describe('NextServerInfra', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<NextServerInfra />);
    expect(screen.getByTestId('rd-server-next')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<NextServerInfra ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
