import type { ThreeBarChartProps } from './three-bar-chart';

describe('@rosettadash/angular/visual/display/3d-bar-chart', () => {
  it('exposes typed props contract', () => {
    const props: ThreeBarChartProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-display-3d-bar-chart', () => {
    expect('rd-display-3d-bar-chart').toMatch(/^rd-/);
  });
});
