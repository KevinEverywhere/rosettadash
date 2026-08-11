export interface PreviewRow {
  id: string;
  name: string;
  status: string;
  amount: number;
  date: string;
}

export interface PreviewNewsRow {
  id: string;
  headline: string;
  source: string;
  region: string;
  publishedAt: string;
  summary: string;
  url: string;
}

export interface PreviewSelectOption {
  label: string;
  value: string;
}

export interface PreviewChartPoint {
  label: string;
  value: number;
}

export type { PreviewScatterPoint } from './map-scatter-points';
export { mapRowsToScatterPoints, resolveScatterFields } from './map-scatter-points';
