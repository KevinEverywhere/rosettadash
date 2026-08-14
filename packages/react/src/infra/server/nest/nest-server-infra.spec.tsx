import { render, screen } from '@testing-library/react';
import { NestServerInfra } from './NestServerInfra.js';

describe('NestServerInfra', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<NestServerInfra />);
    expect(screen.getByTestId('rd-server-nest')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<NestServerInfra ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
