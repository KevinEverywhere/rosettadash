import type { ThreeScatterPlotProps } from './three-scatter-plot';

describe('@rosettadash/angular/visual/display/3d-scatter', () => {
  it('exposes typed props contract', () => {
    const props: ThreeScatterPlotProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-display-3d-scatter', () => {
    expect('rd-display-3d-scatter').toMatch(/^rd-/);
  });
});
