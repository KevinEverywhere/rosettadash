import { render, screen } from '@testing-library/react';
import { TabsLayout } from './TabsLayout.js';

describe('TabsLayout', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<TabsLayout />);
    expect(screen.getByTestId('rd-tabs')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<TabsLayout ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
