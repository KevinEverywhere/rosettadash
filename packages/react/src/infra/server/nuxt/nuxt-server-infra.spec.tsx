import { render, screen } from '@testing-library/react';
import { NuxtServerInfra } from './NuxtServerInfra.js';

describe('NuxtServerInfra', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<NuxtServerInfra />);
    expect(screen.getByTestId('rd-server-nuxt')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<NuxtServerInfra ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
