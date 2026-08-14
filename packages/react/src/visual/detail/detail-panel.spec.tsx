import { render, screen } from '@testing-library/react';
import { DetailPanel } from './DetailPanel.js';

describe('DetailPanel', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<DetailPanel />);
    expect(screen.getByTestId('rd-detail')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<DetailPanel ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
