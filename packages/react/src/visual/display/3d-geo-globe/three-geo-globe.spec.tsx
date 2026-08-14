import { render, screen } from '@testing-library/react';
import { ThreeGeoGlobe } from './ThreeGeoGlobe.js';

describe('ThreeGeoGlobe', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<ThreeGeoGlobe />);
    expect(screen.getByTestId('rd-display-3d-geo-globe')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<ThreeGeoGlobe ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
