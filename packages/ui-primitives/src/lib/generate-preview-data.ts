import type {
  PreviewChartPoint,
  PreviewRow,
  PreviewSelectOption,
} from './preview-types';

export interface PreviewBindingInput {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}

export interface PreviewNodeInput {
  id: string;
  type: string;
  properties?: Record<string, unknown>;
}

export interface PreviewDomainContext {
  client?: { id: string; name: string };
  project?: { id: string; name: string };
  defaultTimeRange?: string;
}

export interface PreviewDataRequest {
  projectName?: string;
  compositeName?: string;
  dateRangePreset?: string;
  domainContext?: PreviewDomainContext;
  limit?: number;
  nodes?: PreviewNodeInput[];
  bindings?: PreviewBindingInput[];
}

export interface NodePreviewSlice {
  tableRows?: PreviewRow[];
  chartPoints?: PreviewChartPoint[];
  dateRangeLabel?: string;
  linkedFromTable?: boolean;
  filteredByDateRange?: boolean;
  selectedRow?: PreviewRow | null;
  linkedToTable?: boolean;
  activeTimePreset?: string;
  skeletonLoading?: boolean;
  skeletonVariant?: string;
  skeletonLines?: number;
  linkedToData?: boolean;
}

export interface PreviewDataBundle {
  tableRows: PreviewRow[];
  chartPoints: PreviewChartPoint[];
  selectOptions: PreviewSelectOption[];
  kpiValue: number;
  kpiDelta: number;
  dateRangeLabel: string;
  nodes: Record<string, NodePreviewSlice>;
}

const COMPANY_PREFIXES = ['Northwind', 'Acme', 'Blue Harbor', 'Summit', 'Lumen'];
const COMPANY_SUFFIXES = ['Logistics', 'Analytics', 'Systems', 'Group', 'Works'];
const STATUSES = ['Active', 'Pending', 'Review', 'Closed'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const PRESET_LABELS: Record<string, string> = {
  'last-7-days': 'Last 7 days',
  'last-30-days': 'Last 30 days',
  qtd: 'Quarter to date',
};

const PRESET_DAYS: Record<string, number> = {
  'last-7-days': 7,
  'last-30-days': 30,
  qtd: 90,
};

export function hashSeed(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash || 1;
}

export function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export function pick<T>(values: T[], random: () => number): T {
  return values[Math.floor(random() * values.length)] ?? values[0];
}

export function formatIsoDate(base: Date, offsetDays: number): string {
  const date = new Date(base);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function readPreset(node?: PreviewNodeInput, fallback = 'last-7-days'): string {
  const preset = node?.properties?.['preset'];
  return typeof preset === 'string' ? preset : fallback;
}

function readTimePreset(node?: PreviewNodeInput, fallback = 'last-7-days'): string {
  const preset = node?.properties?.['defaultPreset'];
  return typeof preset === 'string' ? preset : fallback;
}

function isTimeFilterType(type: string): boolean {
  return type === 'visual.input.date-range' || type === 'domain.time-preset';
}

function resolveActivePreset(
  request: PreviewDataRequest,
  nodes: PreviewNodeInput[],
  domainPreset: string,
): string {
  if (request.dateRangePreset) {
    return request.dateRangePreset;
  }

  const dateRangeNode = nodes.find((node) => node.type === 'visual.input.date-range');
  if (dateRangeNode) {
    return readPreset(dateRangeNode, domainPreset);
  }

  const timePresetNode = nodes.find((node) => node.type === 'domain.time-preset');
  if (timePresetNode) {
    return readTimePreset(timePresetNode, domainPreset);
  }

  return domainPreset;
}

function filterRowsByPreset(rows: PreviewRow[], preset: string): PreviewRow[] {
  const dayCount = PRESET_DAYS[preset] ?? PRESET_DAYS['last-7-days'];
  return rows.filter((row) => {
    const rowDate = new Date(`${row.date}T00:00:00.000Z`);
    const baseDate = new Date('2026-08-08T12:00:00.000Z');
    const diffDays = Math.floor(
      (baseDate.getTime() - rowDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffDays >= 0 && diffDays < dayCount;
  });
}

function rowsToChartPoints(rows: PreviewRow[]): PreviewChartPoint[] {
  if (rows.length === 0) {
    return [{ label: '—', value: 0 }];
  }

  return rows.slice(0, 5).map((row) => ({
    label: row.date.slice(5),
    value: Math.max(1, Math.round(row.amount / 1000)),
  }));
}

function generateBaseRows(request: PreviewDataRequest, random: () => number): PreviewRow[] {
  const limit = Math.min(Math.max(request.limit ?? 10, 3), 12);
  const baseDate = new Date('2026-08-08T12:00:00.000Z');
  const clientName = request.domainContext?.client?.name?.trim();

  return Array.from({ length: limit }, (_, index) => {
    const prefix = pick(COMPANY_PREFIXES, random);
    const suffix = pick(COMPANY_SUFFIXES, random);
    return {
      id: String(index + 1),
      name: clientName ? `${clientName} ${suffix}` : `${prefix} ${suffix}`,
      status: pick(STATUSES, random),
      amount: Math.round(20_000 + random() * 60_000),
      date: formatIsoDate(baseDate, -(index + 1)),
    };
  });
}

function readNodeBoolean(node: PreviewNodeInput | undefined, key: string, fallback: boolean): boolean {
  const value = node?.properties?.[key];
  return typeof value === 'boolean' ? value : fallback;
}

function readNodeNumber(node: PreviewNodeInput | undefined, key: string, fallback: number): number {
  const value = node?.properties?.[key];
  return typeof value === 'number' ? value : fallback;
}

function readNodeString(node: PreviewNodeInput | undefined, key: string, fallback: string): string {
  const value = node?.properties?.[key];
  return typeof value === 'string' ? value : fallback;
}

function resolveSkeletonLoading(
  skeletonNode: PreviewNodeInput,
  nodes: PreviewNodeInput[],
  bindings: PreviewBindingInput[],
): boolean | undefined {
  const loadingBinding = findBindingSource(bindings, skeletonNode.id, 'loading');
  if (!loadingBinding) {
    return undefined;
  }

  const source = nodes.find((node) => node.id === loadingBinding.sourceNodeId);
  if (source?.type === 'visual.input.checkbox') {
    return readNodeBoolean(source, 'defaultChecked', false);
  }

  return undefined;
}

function findBindingSource(
  bindings: PreviewBindingInput[],
  targetNodeId: string,
  targetPortId: string,
): PreviewBindingInput | undefined {
  return bindings.find(
    (binding) =>
      binding.targetNodeId === targetNodeId && binding.targetPortId === targetPortId,
  );
}

function buildDefaultChartPoints(random: () => number): PreviewChartPoint[] {
  return WEEKDAYS.map((label) => ({
    label,
    value: Math.round(35 + random() * 45),
  }));
}

export function resolvePreviewGraph(
  request: PreviewDataRequest = {},
): PreviewDataBundle {
  const nodes = request.nodes ?? [];
  const bindings = request.bindings ?? [];
  const domain = request.domainContext;
  const domainPreset = domain?.defaultTimeRange ?? 'last-7-days';
  const seedKey = [
    request.projectName ?? 'project',
    request.compositeName ?? 'composite',
    domain?.client?.id ?? domain?.client?.name ?? '',
    domain?.project?.id ?? domain?.project?.name ?? '',
    request.dateRangePreset ?? domainPreset,
  ].join(':');
  const random = createRandom(hashSeed(seedKey));

  const activePreset = resolveActivePreset(request, nodes, domainPreset);
  const dateRangeLabel = PRESET_LABELS[activePreset] ?? PRESET_LABELS['last-7-days'];

  const baseRows = generateBaseRows(request, random);
  const filteredRows = filterRowsByPreset(baseRows, activePreset);

  const nodeSlices: Record<string, NodePreviewSlice> = {};
  const tableNodes = nodes.filter((node) => node.type === 'visual.table');
  const chartNodes = nodes.filter(
    (node) =>
      node.type === 'visual.chart.line' ||
      node.type === 'visual.chart.bar' ||
      node.type === 'visual.chart.pie' ||
      node.type === 'visual.display.3d-bar-chart' ||
      node.type === 'visual.display.3d-scatter',
  );

  for (const tableNode of tableNodes) {
    const filterBinding = findBindingSource(bindings, tableNode.id, 'filter');
    const usesDateFilter =
      !!filterBinding &&
      nodes.some(
        (node) =>
          node.id === filterBinding.sourceNodeId && isTimeFilterType(node.type),
      );

    nodeSlices[tableNode.id] = {
      tableRows: usesDateFilter ? filteredRows : baseRows,
      filteredByDateRange: usesDateFilter,
      dateRangeLabel: usesDateFilter ? dateRangeLabel : undefined,
    };
  }

  const primaryTableRows =
    tableNodes.length > 0
      ? (nodeSlices[tableNodes[0].id]?.tableRows ?? filteredRows)
      : filteredRows;

  for (const chartNode of chartNodes) {
    const rangeBinding = findBindingSource(bindings, chartNode.id, 'range');
    const rangeFromDateFilter =
      !!rangeBinding &&
      nodes.some(
        (node) =>
          node.id === rangeBinding.sourceNodeId && isTimeFilterType(node.type),
      );

    const linkedFromTable = tableNodes.length > 0;
    const chartRows = linkedFromTable ? primaryTableRows : filteredRows;

    nodeSlices[chartNode.id] = {
      chartPoints: rowsToChartPoints(chartRows),
      linkedFromTable,
      filteredByDateRange: rangeFromDateFilter,
      dateRangeLabel: rangeFromDateFilter ? dateRangeLabel : undefined,
    };
  }

  const sceneNodes = nodes.filter((node) => node.type === 'visual.display.3d-scene');
  for (const sceneNode of sceneNodes) {
    const dataBinding = findBindingSource(bindings, sceneNode.id, 'data');
    const linkedFromTable =
      tableNodes.length > 0 &&
      (!dataBinding || tableNodes.some((table) => table.id === dataBinding.sourceNodeId));

    nodeSlices[sceneNode.id] = {
      chartPoints: linkedFromTable ? rowsToChartPoints(primaryTableRows) : undefined,
      linkedFromTable,
    };
  }

  for (const node of nodes) {
    if (node.type === 'visual.input.date-range') {
      nodeSlices[node.id] = {
        dateRangeLabel,
      };
    }
    if (node.type === 'domain.time-preset') {
      nodeSlices[node.id] = {
        dateRangeLabel,
        activeTimePreset: activePreset,
      };
    }
  }

  const detailNodes = nodes.filter((node) => node.type === 'visual.detail');
  for (const detailNode of detailNodes) {
    const rowBinding = findBindingSource(bindings, detailNode.id, 'row');
    const sourceTable = rowBinding
      ? tableNodes.find((table) => table.id === rowBinding.sourceNodeId)
      : undefined;
    const rows = sourceTable
      ? (nodeSlices[sourceTable.id]?.tableRows ?? filteredRows)
      : undefined;

    nodeSlices[detailNode.id] = {
      selectedRow: rows?.[0] ?? null,
      linkedToTable: !!sourceTable,
    };
  }

  const hasDataVisuals =
    tableNodes.length > 0 ||
    chartNodes.length > 0 ||
    nodes.some((node) => node.type === 'visual.kpi');

  for (const skeletonNode of nodes.filter((node) => node.type === 'visual.skeleton')) {
    nodeSlices[skeletonNode.id] = {
      skeletonLoading: resolveSkeletonLoading(skeletonNode, nodes, bindings),
      skeletonVariant: readNodeString(skeletonNode, 'variant', 'table'),
      skeletonLines: readNodeNumber(skeletonNode, 'lines', 4),
      linkedToData: hasDataVisuals,
    };
  }

  return {
    tableRows: filteredRows,
    chartPoints: tableNodes.length
      ? rowsToChartPoints(primaryTableRows)
      : buildDefaultChartPoints(random),
    selectOptions: [
      { label: 'Revenue', value: 'revenue' },
      { label: 'Orders', value: 'orders' },
      { label: 'Customers', value: 'customers' },
      {
        label: `${domain?.project?.name ?? request.projectName ?? 'Project'} KPI`,
        value: 'project-kpi',
      },
    ],
    kpiValue: Math.round(90_000 + random() * 80_000),
    kpiDelta: Math.round((random() * 12 + 2) * 10) / 10,
    dateRangeLabel,
    nodes: nodeSlices,
  };
}

export function generatePreviewData(
  request: PreviewDataRequest = {},
): PreviewDataBundle {
  return resolvePreviewGraph(request);
}

export function getDefaultPreviewData(): PreviewDataBundle {
  return resolvePreviewGraph();
}
