import { render, screen } from '@testing-library/react';
import { ExpressServerInfra } from './ExpressServerInfra.js';

describe('ExpressServerInfra', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<ExpressServerInfra />);
    expect(screen.getByTestId('rd-server-express')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<ExpressServerInfra ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
