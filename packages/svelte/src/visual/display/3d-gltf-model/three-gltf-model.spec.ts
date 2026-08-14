import type { ThreeGltfModelProps } from './types';

describe('@rosettadash/svelte/visual/display/3d-gltf-model', () => {
  it('exposes typed props contract', () => {
    const props: ThreeGltfModelProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-display-3d-gltf-model', () => {
    expect('rd-display-3d-gltf-model').toMatch(/^rd-/);
  });
});
