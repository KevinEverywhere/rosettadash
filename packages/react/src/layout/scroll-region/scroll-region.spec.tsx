import { render, screen } from '@testing-library/react';
import { ScrollRegion } from './ScrollRegion.js';

describe('ScrollRegion', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<ScrollRegion>Content</ScrollRegion>);
    expect(screen.getByTestId('rd-scroll-region')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<ScrollRegion ref={ref}>Content</ScrollRegion>);
    expect(ref.current).toBeTruthy();
  });
});
