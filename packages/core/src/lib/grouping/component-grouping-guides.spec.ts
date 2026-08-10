import {
  computeCompanionLayout,
  getGroupingGuide,
  listMissingCompanionTypes,
  resolveCompanionPlacement,
} from './component-grouping-guides';

describe('component-grouping-guides', () => {
  it('returns a guide for table and date-range types', () => {
    expect(getGroupingGuide('visual.table')?.companionTypes).toContain('visual.input.date-range');
    expect(getGroupingGuide('visual.input.date-range')?.animationKey).toBe('filter-table');
  });

  it('lists missing companion types on the canvas', () => {
    const missing = listMissingCompanionTypes('visual.table', ['visual.table']);
    expect(missing).toContain('visual.input.date-range');
    expect(missing).toContain('infra.postgresql');
    expect(missing).not.toContain('visual.table');
  });

  it('places date-range above table when table is the source', () => {
    expect(resolveCompanionPlacement('visual.table', 'visual.input.date-range')).toBe('above');
  });

  it('places table below date-range when date-range is the source', () => {
    expect(resolveCompanionPlacement('visual.input.date-range', 'visual.table')).toBe('below');
  });

  it('returns a guide for pie chart with date-range companion', () => {
    expect(getGroupingGuide('visual.chart.pie')?.companionTypes).toContain('visual.input.date-range');
  });

  it('returns a guide for detail panel with table companion', () => {
    expect(getGroupingGuide('visual.detail')?.companionTypes).toContain('visual.table');
    expect(resolveCompanionPlacement('visual.table', 'visual.detail')).toBe('right');
  });

  it('returns a guide for time preset with table companion', () => {
    expect(getGroupingGuide('domain.time-preset')?.companionTypes).toContain('visual.table');
    expect(getGroupingGuide('visual.table')?.companionTypes).toContain('domain.time-preset');
    expect(resolveCompanionPlacement('visual.table', 'domain.time-preset')).toBe('above');
  });

  it('returns a guide for skeleton with table companion', () => {
    expect(getGroupingGuide('visual.skeleton')?.companionTypes).toContain('visual.table');
    expect(getGroupingGuide('visual.table')?.companionTypes).toContain('visual.skeleton');
  });

  it('returns a guide for timer with table companion', () => {
    expect(getGroupingGuide('logic.timer')?.companionTypes).toContain('visual.table');
  });

  it('computes snapped companion layout above the source node', () => {
    const layout = computeCompanionLayout(
      { x: 48, y: 96, width: 220, height: 72 },
      'visual.table',
      'visual.input.date-range',
    );

    expect(layout.x).toBe(48);
    expect(layout.y).toBe(16);
    expect(layout.width).toBe(220);
  });
});
