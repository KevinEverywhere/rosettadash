import { render, screen } from '@testing-library/react';
import { ThreeGltfModel } from './ThreeGltfModel.js';

describe('ThreeGltfModel', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<ThreeGltfModel />);
    expect(screen.getByTestId('rd-display-3d-gltf-model')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<ThreeGltfModel ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
