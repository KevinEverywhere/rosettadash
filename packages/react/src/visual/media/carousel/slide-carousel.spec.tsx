import { render, screen } from '@testing-library/react';
import { SlideCarousel } from './SlideCarousel.js';

describe('SlideCarousel', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<SlideCarousel />);
    expect(screen.getByTestId('rd-media-carousel')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<SlideCarousel ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
