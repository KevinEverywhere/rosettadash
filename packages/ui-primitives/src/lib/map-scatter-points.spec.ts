import { mapRowsToScatterPoints, resolveScatterFields } from './map-scatter-points';
import type { PreviewRow } from './preview-types';

describe('mapRowsToScatterPoints', () => {
  const rows: PreviewRow[] = [
    { id: '1', name: 'Alpha', status: 'active', amount: 10_000, date: '2026-08-01' },
    { id: '2', name: 'Beta', status: 'pending', amount: 25_000, date: '2026-08-02' },
    { id: '3', name: 'Gamma', status: 'active', amount: 15_000, date: '2026-08-03' },
  ];

  it('maps configured rowset fields to scatter coordinates', () => {
    const points = mapRowsToScatterPoints(rows, {
      xField: 'amount',
      yField: 'id',
      zField: 'date',
    });

    expect(points).toHaveLength(3);
    expect(points[0]?.label).toBe('Alpha');
    expect(points[1]?.x).not.toBe(points[0]?.x);
    expect(points[1]?.y).not.toBe(points[0]?.y);
    expect(points[1]?.z).not.toBe(points[0]?.z);
  });

  it('uses date/amount/id defaults from node properties', () => {
    const fields = resolveScatterFields({
      xField: 'date',
      yField: 'amount',
      zField: 'id',
    });

    const points = mapRowsToScatterPoints(rows, fields);
    expect(points).toHaveLength(3);
    expect(points.every((point) => Number.isFinite(point.x))).toBe(true);
    expect(points.every((point) => Number.isFinite(point.y))).toBe(true);
    expect(points.every((point) => Number.isFinite(point.z))).toBe(true);
  });

  it('returns demo points when rowset is empty', () => {
    expect(mapRowsToScatterPoints([])).toHaveLength(5);
  });
});
