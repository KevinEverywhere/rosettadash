import {
  PREVIEW_CHART_POINTS,
  PREVIEW_SELECT_OPTIONS,
  PREVIEW_TABLE_ROWS,
} from './mock-data';

describe('preview mock data', () => {
  it('provides table rows for preview renderers', () => {
    expect(PREVIEW_TABLE_ROWS.length).toBeGreaterThan(0);
    expect(PREVIEW_TABLE_ROWS[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
    });
  });

  it('provides select options and chart points', () => {
    expect(PREVIEW_SELECT_OPTIONS.length).toBeGreaterThan(0);
    expect(PREVIEW_CHART_POINTS.length).toBeGreaterThan(0);
  });
});
