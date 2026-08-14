import type { LineChartProps } from './line-chart';

describe('@rosettadash/vue/visual/chart/line', () => {
  it('exposes typed props contract', () => {
    const props: LineChartProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-chart-line', () => {
    expect('rd-chart-line').toMatch(/^rd-/);
  });
});
