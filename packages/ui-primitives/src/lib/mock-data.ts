export interface PreviewRow {
  id: string;
  name: string;
  status: string;
  amount: number;
  date: string;
}

export interface PreviewSelectOption {
  label: string;
  value: string;
}

export interface PreviewChartPoint {
  label: string;
  value: number;
}

export const PREVIEW_TABLE_ROWS: PreviewRow[] = [
  {
    id: '1',
    name: 'Northwind Logistics',
    status: 'Active',
    amount: 48200,
    date: '2026-08-01',
  },
  {
    id: '2',
    name: 'Acme Analytics',
    status: 'Pending',
    amount: 31850,
    date: '2026-08-03',
  },
  {
    id: '3',
    name: 'Blue Harbor Co.',
    status: 'Active',
    amount: 27640,
    date: '2026-08-05',
  },
];

export const PREVIEW_SELECT_OPTIONS: PreviewSelectOption[] = [
  { label: 'Revenue', value: 'revenue' },
  { label: 'Orders', value: 'orders' },
  { label: 'Customers', value: 'customers' },
];

export const PREVIEW_KPI_VALUE = 128_400;

export const PREVIEW_KPI_DELTA = 8.4;

export const PREVIEW_CHART_POINTS: PreviewChartPoint[] = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 58 },
  { label: 'Wed', value: 51 },
  { label: 'Thu', value: 73 },
  { label: 'Fri', value: 66 },
];

export const PREVIEW_DATE_RANGE_LABEL = 'Last 7 days';
