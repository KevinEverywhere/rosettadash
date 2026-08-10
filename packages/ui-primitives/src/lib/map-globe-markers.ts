import type { PreviewRow } from './preview-types';

export interface PreviewGlobeMarker {
  lat: number;
  lng: number;
  label?: string;
}

export interface GlobeFieldConfig {
  latField: string;
  lngField: string;
  labelField: string;
}

const DEFAULT_GLOBE_FIELDS: GlobeFieldConfig = {
  latField: 'lat',
  lngField: 'lng',
  labelField: 'name',
};

const DEMO_GLOBE_MARKERS: PreviewGlobeMarker[] = [
  { lat: 40.7128, lng: -74.006, label: 'New York' },
  { lat: 51.5074, lng: -0.1278, label: 'London' },
  { lat: 35.6762, lng: 139.6503, label: 'Tokyo' },
  { lat: -33.8688, lng: 151.2093, label: 'Sydney' },
  { lat: -23.5505, lng: -46.6333, label: 'São Paulo' },
];

export function resolveGlobeFields(
  properties: Record<string, unknown> | undefined,
): GlobeFieldConfig {
  return {
    latField: readStringProperty(properties, 'latField', DEFAULT_GLOBE_FIELDS.latField),
    lngField: readStringProperty(properties, 'lngField', DEFAULT_GLOBE_FIELDS.lngField),
    labelField: readStringProperty(properties, 'labelField', DEFAULT_GLOBE_FIELDS.labelField),
  };
}

export function mapRowsToGlobeMarkers(
  rows: PreviewRow[],
  fields: GlobeFieldConfig = DEFAULT_GLOBE_FIELDS,
): PreviewGlobeMarker[] {
  if (rows.length === 0) {
    return DEMO_GLOBE_MARKERS;
  }

  return rows.slice(0, 48).map((row, index) => {
    const record = row as unknown as Record<string, unknown>;
    const lat = readLatLng(record, fields.latField);
    const lng = readLatLng(record, fields.lngField);
    const label = String(record[fields.labelField] ?? row.name ?? row.id ?? index + 1);

    if (lat !== null && lng !== null) {
      return { lat, lng, label };
    }

    const fallback = DEMO_GLOBE_MARKERS[index % DEMO_GLOBE_MARKERS.length] ?? DEMO_GLOBE_MARKERS[0]!;
    return {
      lat: fallback.lat,
      lng: fallback.lng,
      label,
    };
  });
}

export function latLngToGlobePosition(
  lat: number,
  lng: number,
  radius: number,
): { x: number; y: number; z: number } {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  const surfaceRadius = radius + 0.06;

  return {
    x: -surfaceRadius * Math.sin(phi) * Math.cos(theta),
    y: surfaceRadius * Math.cos(phi),
    z: surfaceRadius * Math.sin(phi) * Math.sin(theta),
  };
}

function readLatLng(row: Record<string, unknown>, field: string): number | null {
  const value = row[field];
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function readStringProperty(
  properties: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const value = properties?.[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}
