import { readNumber } from '../../../lib/element-utils.js';
import type { GeoMapView } from './geo-map-types.js';
import { DEFAULT_GEO_MAP_VIEW } from './geo-map-types.js';

export function parseGeoMapCenter(raw: string | null, fallback: GeoMapView = DEFAULT_GEO_MAP_VIEW): {
  lat: number;
  lng: number;
} {
  if (!raw) {
    return { lat: fallback.lat, lng: fallback.lng };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object') {
      const record = parsed as Record<string, unknown>;
      return {
        lat: readNumber(record['lat'], fallback.lat),
        lng: readNumber(record['lng'], fallback.lng),
      };
    }
  } catch {
    const parts = raw.split(',').map((part) => part.trim());
    if (parts.length >= 2) {
      return {
        lat: readNumber(parts[0], fallback.lat),
        lng: readNumber(parts[1], fallback.lng),
      };
    }
  }

  return { lat: fallback.lat, lng: fallback.lng };
}
