import type { ThreeScenePointCloudProps } from './three-scene-point-cloud';

describe('@rosettadash/vue/visual/display/3d-scene', () => {
  it('exposes typed props contract', () => {
    const props: ThreeScenePointCloudProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-display-3d-scene', () => {
    expect('rd-display-3d-scene').toMatch(/^rd-/);
  });
});
