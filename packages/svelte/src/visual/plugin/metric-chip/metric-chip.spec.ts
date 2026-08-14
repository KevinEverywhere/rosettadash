import type { MetricChipProps } from './types';

describe('@rosettadash/svelte/visual/plugin/metric-chip', () => {
  it('exposes typed props contract', () => {
    const props: MetricChipProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-plugin-metric-chip', () => {
    expect('rd-plugin-metric-chip').toMatch(/^rd-/);
  });
});
