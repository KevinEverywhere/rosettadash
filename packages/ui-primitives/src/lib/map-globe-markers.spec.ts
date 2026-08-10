import {
  latLngToGlobePosition,
  mapRowsToGlobeMarkers,
  resolveGlobeFields,
} from './map-globe-markers';
import type { PreviewRow } from './preview-types';

describe('mapRowsToGlobeMarkers', () => {
  const rows = [
    { id: '1', name: 'HQ', lat: 37.7749, lng: -122.4194, amount: 1000 },
    { id: '2', name: 'EU', lat: 48.8566, lng: 2.3522, amount: 800 },
  ] as unknown as PreviewRow[];

  it('maps configured lat/lng fields to globe markers', () => {
    const markers = mapRowsToGlobeMarkers(rows, {
      latField: 'lat',
      lngField: 'lng',
      labelField: 'name',
    });

    expect(markers).toHaveLength(2);
    expect(markers[0]?.label).toBe('HQ');
    expect(markers[0]?.lat).toBeCloseTo(37.7749);
    expect(markers[0]?.lng).toBeCloseTo(-122.4194);
  });

  it('uses defaults from node properties', () => {
    const fields = resolveGlobeFields({ latField: 'lat', lngField: 'lng', labelField: 'name' });
    const markers = mapRowsToGlobeMarkers(rows, fields);
    expect(markers).toHaveLength(2);
  });

  it('returns demo markers when rowset is empty', () => {
    expect(mapRowsToGlobeMarkers([])).toHaveLength(5);
  });

  it('projects lat/lng to a sphere surface position', () => {
    const point = latLngToGlobePosition(90, 0, 2);
    expect(point.y).toBeCloseTo(2.06, 1);
    expect(Number.isFinite(point.x)).toBe(true);
    expect(Number.isFinite(point.z)).toBe(true);
  });
});
