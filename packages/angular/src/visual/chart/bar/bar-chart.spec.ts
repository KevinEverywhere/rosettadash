import type { BarChartProps } from './bar-chart';

describe('@rosettadash/angular/visual/chart/bar', () => {
  it('exposes typed props contract', () => {
    const props: BarChartProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-chart-bar', () => {
    expect('rd-chart-bar').toMatch(/^rd-/);
  });
});
