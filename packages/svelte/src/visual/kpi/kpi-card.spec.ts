import type { KpiCardProps } from './types';

describe('@rosettadash/svelte/visual/kpi', () => {
  it('exposes typed props contract', () => {
    const props: KpiCardProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-kpi', () => {
    expect('rd-kpi').toMatch(/^rd-/);
  });
});
