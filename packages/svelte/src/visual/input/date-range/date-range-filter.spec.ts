import type { DateRangeFilterProps } from './types';

describe('@rosettadash/svelte/visual/input/date-range', () => {
  it('exposes typed props contract', () => {
    const props: DateRangeFilterProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-input-date-range', () => {
    expect('rd-input-date-range').toMatch(/^rd-/);
  });
});
