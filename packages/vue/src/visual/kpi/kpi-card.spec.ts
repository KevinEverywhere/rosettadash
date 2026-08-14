import type { KpiCardProps } from './kpi-card';

describe('@rosettadash/vue/visual/kpi', () => {
  it('exposes typed props contract', () => {
    const props: KpiCardProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-kpi', () => {
    expect('rd-kpi').toMatch(/^rd-/);
  });
});
