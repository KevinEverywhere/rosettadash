import type {
  PreviewChartPoint,
  PreviewRow,
  PreviewSelectOption,
} from './preview-types';

export interface PreviewDataRequest {
  projectName?: string;
  compositeName?: string;
  dateRangePreset?: string;
  limit?: number;
}

export interface PreviewDataBundle {
  tableRows: PreviewRow[];
  chartPoints: PreviewChartPoint[];
  selectOptions: PreviewSelectOption[];
  kpiValue: number;
  kpiDelta: number;
  dateRangeLabel: string;
}

const COMPANY_PREFIXES = ['Northwind', 'Acme', 'Blue Harbor', 'Summit', 'Lumen'];
const COMPANY_SUFFIXES = ['Logistics', 'Analytics', 'Systems', 'Group', 'Works'];
const STATUSES = ['Active', 'Pending', 'Review', 'Closed'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const PRESET_LABELS: Record<string, string> = {
  'last-7-days': 'Last 7 days',
  'last-30-days': 'Last 30 days',
  qtd: 'Quarter to date',
};

export function hashSeed(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash || 1;
}

function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function pick<T>(values: T[], random: () => number): T {
  return values[Math.floor(random() * values.length)] ?? values[0];
}

function formatIsoDate(base: Date, offsetDays: number): string {
  const date = new Date(base);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function generatePreviewData(
  request: PreviewDataRequest = {},
): PreviewDataBundle {
  const seedKey = [
    request.projectName ?? 'project',
    request.compositeName ?? 'composite',
    request.dateRangePreset ?? 'last-7-days',
  ].join(':');
  const random = createRandom(hashSeed(seedKey));
  const limit = Math.min(Math.max(request.limit ?? 3, 1), 10);
  const baseDate = new Date('2026-08-08T12:00:00.000Z');

  const tableRows: PreviewRow[] = Array.from({ length: limit }, (_, index) => {
    const prefix = pick(COMPANY_PREFIXES, random);
    const suffix = pick(COMPANY_SUFFIXES, random);
    return {
      id: String(index + 1),
      name: `${prefix} ${suffix}`,
      status: pick(STATUSES, random),
      amount: Math.round(20_000 + random() * 60_000),
      date: formatIsoDate(baseDate, -(index + 1)),
    };
  });

  const chartPoints: PreviewChartPoint[] = WEEKDAYS.map((label) => ({
    label,
    value: Math.round(35 + random() * 45),
  }));

  const selectOptions: PreviewSelectOption[] = [
    { label: 'Revenue', value: 'revenue' },
    { label: 'Orders', value: 'orders' },
    { label: 'Customers', value: 'customers' },
    { label: `${request.projectName ?? 'Project'} KPI`, value: 'project-kpi' },
  ];

  const kpiValue = Math.round(90_000 + random() * 80_000);
  const kpiDelta = Math.round((random() * 12 + 2) * 10) / 10;

  return {
    tableRows,
    chartPoints,
    selectOptions,
    kpiValue,
    kpiDelta,
    dateRangeLabel:
      PRESET_LABELS[request.dateRangePreset ?? 'last-7-days'] ?? 'Last 7 days',
  };
}

export function getDefaultPreviewData(): PreviewDataBundle {
  return generatePreviewData();
}
