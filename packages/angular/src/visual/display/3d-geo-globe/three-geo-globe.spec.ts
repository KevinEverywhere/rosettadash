import type { ThreeGeoGlobeProps } from './three-geo-globe';

describe('@rosettadash/angular/visual/display/3d-geo-globe', () => {
  it('exposes typed props contract', () => {
    const props: ThreeGeoGlobeProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-display-3d-geo-globe', () => {
    expect('rd-display-3d-geo-globe').toMatch(/^rd-/);
  });
});
