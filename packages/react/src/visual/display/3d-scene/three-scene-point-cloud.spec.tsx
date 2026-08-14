import { render, screen } from '@testing-library/react';
import { ThreeScenePointCloud } from './ThreeScenePointCloud.js';

describe('ThreeScenePointCloud', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<ThreeScenePointCloud />);
    expect(screen.getByTestId('rd-display-3d-scene')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<ThreeScenePointCloud ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
