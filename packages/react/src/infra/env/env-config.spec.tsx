import { render, screen } from '@testing-library/react';
import { EnvConfig } from './EnvConfig.js';

describe('EnvConfig', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<EnvConfig />);
    expect(screen.getByTestId('rd-env')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<EnvConfig ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
