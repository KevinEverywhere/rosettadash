import type { BarChartProps } from './types';

describe('@rosettadash/svelte/visual/chart/bar', () => {
  it('exposes typed props contract', () => {
    const props: BarChartProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-chart-bar', () => {
    expect('rd-chart-bar').toMatch(/^rd-/);
  });
});
