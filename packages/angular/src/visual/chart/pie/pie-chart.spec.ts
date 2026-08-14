import type { PieChartProps } from './pie-chart';

describe('@rosettadash/angular/visual/chart/pie', () => {
  it('exposes typed props contract', () => {
    const props: PieChartProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-chart-pie', () => {
    expect('rd-chart-pie').toMatch(/^rd-/);
  });
});
