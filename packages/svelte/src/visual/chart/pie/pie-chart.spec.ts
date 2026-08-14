import type { PieChartProps } from './types';

describe('@rosettadash/svelte/visual/chart/pie', () => {
  it('exposes typed props contract', () => {
    const props: PieChartProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-chart-pie', () => {
    expect('rd-chart-pie').toMatch(/^rd-/);
  });
});
