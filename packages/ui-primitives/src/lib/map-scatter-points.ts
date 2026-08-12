import type { PreviewRow } from './preview-types';

export interface PreviewScatterPoint {
  x: number;
  y: number;
  z: number;
  label?: string;
}

export interface ScatterFieldConfig {
  xField: string;
  yField: string;
  zField: string;
}

const DEFAULT_SCATTER_FIELDS: ScatterFieldConfig = {
  xField: 'date',
  yField: 'amount',
  zField: 'id',
};

export function resolveScatterFields(
  properties: Record<string, unknown> | undefined,
): ScatterFieldConfig {
  return {
    xField: readStringProperty(properties, 'xField', DEFAULT_SCATTER_FIELDS.xField),
    yField: readStringProperty(properties, 'yField', DEFAULT_SCATTER_FIELDS.yField),
    zField: readStringProperty(properties, 'zField', DEFAULT_SCATTER_FIELDS.zField),
  };
}

export function mapRowsToScatterPoints(
  rows: PreviewRow[],
  fields: ScatterFieldConfig = DEFAULT_SCATTER_FIELDS,
): PreviewScatterPoint[] {
  if (rows.length === 0) {
    return defaultScatterPoints();
  }

  const raw = rows.slice(0, 48).map((row, index) => ({
    x: readNumericField(row as unknown as Record<string, unknown>, fields.xField, index),
    y: readNumericField(row as unknown as Record<string, unknown>, fields.yField, index + 1),
    z: readNumericField(row as unknown as Record<string, unknown>, fields.zField, index * 0.75 + 1),
    label: String(row.name ?? row.id ?? index + 1),
  }));

  return normalizeScatterPoints(raw);
}

function readStringProperty(
  properties: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const value = properties?.[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function readNumericField(row: Record<string, unknown>, field: string, fallback: number): number {
  const value = row[field];
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }

    const timestamp = Date.parse(value);
    if (Number.isFinite(timestamp)) {
      return timestamp / 86_400_000;
    }
  }

  return fallback;
}

function normalizeScatterPoints(points: PreviewScatterPoint[]): PreviewScatterPoint[] {
  if (points.length === 0) {
    return points;
  }

  const normalizeAxis = (values: number[], spread = 8, floor = 0.2): number[] => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    return values.map((value) => ((value - min) / span) * spread + floor);
  };

  const xs = normalizeAxis(points.map((point) => point.x), 8, -4);
  const ys = normalizeAxis(points.map((point) => point.y), 4, 0.2);
  const zs = normalizeAxis(points.map((point) => point.z), 8, -4);

  return points.map((point, index) => ({
    ...point,
    x: xs[index] ?? point.x,
    y: ys[index] ?? point.y,
    z: zs[index] ?? point.z,
  }));
}

function defaultScatterPoints(): PreviewScatterPoint[] {
  return [
    { x: -2, y: 1.2, z: -2, label: 'A' },
    { x: 0, y: 2.4, z: 1, label: 'B' },
    { x: 2, y: 0.8, z: 2, label: 'C' },
    { x: -1, y: 3.1, z: -1, label: 'D' },
    { x: 1.5, y: 1.6, z: -2.5, label: 'E' },
  ];
}
