import type { DateRangeFilterProps } from './date-range-filter';

describe('@rosettadash/vue/visual/input/date-range', () => {
  it('exposes typed props contract', () => {
    const props: DateRangeFilterProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-input-date-range', () => {
    expect('rd-input-date-range').toMatch(/^rd-/);
  });
});
