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

  it('renders per-key status when keyStatus is provided', () => {
    render(
      <EnvConfig
        envKeys="GOOGLE_MAPS_KEY, NEWS_API_KEY"
        keyStatus={[
          { envKey: 'GOOGLE_MAPS_KEY', configured: true },
          { envKey: 'NEWS_API_KEY', configured: false },
        ]}
      />,
    );
    expect(screen.getByText('configured')).toBeTruthy();
    expect(screen.getByText('missing')).toBeTruthy();
  });
});
