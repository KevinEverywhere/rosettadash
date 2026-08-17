import { readNumber, readString } from '../../../lib/element-utils.js';
import type { GeoMapMarker } from './geo-map-types.js';

export function parseGeoMapMarkers(raw: string | null): GeoMapMarker[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((entry): GeoMapMarker | null => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }
        const record = entry as Record<string, unknown>;
        const id = readString(record['id'], '');
        const lat = readNumber(record['lat'], Number.NaN);
        const lng = readNumber(record['lng'], Number.NaN);
        if (!id || !Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }
        const label = readString(record['label'], '');
        return label ? { id, lat, lng, label } : { id, lat, lng };
      })
      .filter((item): item is GeoMapMarker => item !== null);
  } catch {
    return [];
  }
}
