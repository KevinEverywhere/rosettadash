import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import type { Binding, ComponentNode, Composite } from '../model/types';
import type { BuildCompositeTemplateOptions } from './template-types';

type FilterType = 'visual.input.date-range' | 'domain.time-preset' | 'visual.input.select';
type ChartType = 'visual.chart.line' | 'visual.chart.bar' | 'visual.chart.pie';

export interface DashboardStarterKpiSpec {
  id: string;
  label: string;
  title: string;
  format?: 'number' | 'currency' | 'percent';
  subtitle?: string;
  properties?: Record<string, unknown>;
}

export interface DashboardStarterSpec {
  templateId: string;
  name: string;
  description: string;
  postgresTable: string;
  dataSourceLabel?: string;
  filter: {
    id: string;
    label: string;
    type: FilterType;
    properties?: Record<string, unknown>;
    subtitle?: string;
  };
  kpis: DashboardStarterKpiSpec[];
  table: {
    id: string;
    label: string;
    pageSize?: number;
    subtitle?: string;
    properties?: Record<string, unknown>;
  };
  chart: {
    id: string;
    label: string;
    type: ChartType;
    title: string;
    subtitle?: string;
    properties?: Record<string, unknown>;
  };
  detail?: {
    id: string;
    label: string;
    title?: string;
    subtitle?: string;
    properties?: Record<string, unknown>;
  };
}

const CONTENT_WIDTH = 572;
const MARGIN = 24;
const FILTER_HEIGHT = 88;
const KPI_HEIGHT = 96;
const KPI_WIDTH = 176;
const KPI_GAP = 12;
const TABLE_HEIGHT = 176;
const CHART_HEIGHT = 160;
const DETAIL_HEIGHT = 144;

function kpiRowY(): number {
  return MARGIN + FILTER_HEIGHT + 16;
}

function tableY(kpiCount: number): number {
  return kpiRowY() + KPI_HEIGHT + 16;
}

function chartY(kpiCount: number, hasDetail: boolean): number {
  const base = tableY(kpiCount) + TABLE_HEIGHT + 16;
  return hasDetail ? base : base;
}

function detailY(kpiCount: number): number {
  return chartY(kpiCount, true) + CHART_HEIGHT + 16;
}

function bindsTimeFilter(filterType: FilterType): boolean {
  return filterType === 'visual.input.date-range' || filterType === 'domain.time-preset';
}

function mergeNodeProperties(
  base: Record<string, unknown> | undefined,
  subtitle: string | undefined,
  dataSource: string | undefined,
): Record<string, unknown> {
  return {
    ...base,
    ...(subtitle ? { subtitle } : {}),
    ...(dataSource ? { dataSource } : {}),
  };
}

export function buildDashboardStarterComposite(
  spec: DashboardStarterSpec,
  registry: ComponentRegistry = defaultComponentRegistry,
  options: BuildCompositeTemplateOptions = {},
): Composite {
  const pgId = `${spec.templateId}-pg`;
  const nodes: ComponentNode[] = [];
  const bindings: Binding[] = [];

  const dataSource = spec.dataSourceLabel ?? `PostgreSQL · ${spec.postgresTable}`;

  const filter = registry.createNode(spec.filter.type, {
    id: spec.filter.id,
    label: spec.filter.label,
    layout: { x: MARGIN, y: MARGIN, width: CONTENT_WIDTH, height: FILTER_HEIGHT },
    properties: mergeNodeProperties(spec.filter.properties, spec.filter.subtitle, dataSource),
  });
  nodes.push(filter);

  spec.kpis.forEach((kpiSpec, index) => {
    const kpiWidth =
      spec.kpis.length > 2
        ? Math.floor((CONTENT_WIDTH - KPI_GAP * (spec.kpis.length - 1)) / spec.kpis.length)
        : KPI_WIDTH;
    nodes.push(
      registry.createNode('visual.kpi', {
        id: kpiSpec.id,
        label: kpiSpec.label,
        layout: {
          x: MARGIN + index * (kpiWidth + KPI_GAP),
          y: kpiRowY(),
          width: kpiWidth,
          height: KPI_HEIGHT,
        },
        properties: mergeNodeProperties(
          {
            title: kpiSpec.title,
            format: kpiSpec.format ?? 'number',
            ...kpiSpec.properties,
          },
          kpiSpec.subtitle,
          dataSource,
        ),
      }),
    );
  });

  const hasDetail = !!spec.detail;
  nodes.push(
    registry.createNode('visual.table', {
      id: spec.table.id,
      label: spec.table.label,
      layout: {
        x: MARGIN,
        y: tableY(spec.kpis.length),
        width: CONTENT_WIDTH,
        height: TABLE_HEIGHT,
      },
      properties: mergeNodeProperties(
        { pageSize: spec.table.pageSize ?? 20, ...spec.table.properties },
        spec.table.subtitle,
        dataSource,
      ),
    }),
  );

  nodes.push(
    registry.createNode(spec.chart.type, {
      id: spec.chart.id,
      label: spec.chart.label,
      layout: {
        x: MARGIN,
        y: chartY(spec.kpis.length, hasDetail),
        width: CONTENT_WIDTH,
        height: CHART_HEIGHT,
      },
      properties: mergeNodeProperties(
        { title: spec.chart.title, xField: 'date', yField: 'value', ...spec.chart.properties },
        spec.chart.subtitle,
        dataSource,
      ),
    }),
  );

  if (spec.detail) {
    nodes.push(
      registry.createNode('visual.detail', {
        id: spec.detail.id,
        label: spec.detail.label,
        layout: {
          x: MARGIN,
          y: detailY(spec.kpis.length),
          width: CONTENT_WIDTH,
          height: DETAIL_HEIGHT,
        },
        properties: mergeNodeProperties(
          {
            title: spec.detail.title ?? spec.detail.label,
            emptyMessage: 'Select a row to view details',
            ...spec.detail.properties,
          },
          spec.detail.subtitle,
          dataSource,
        ),
      }),
    );

    bindings.push({
      id: `${spec.templateId}-detail-bind`,
      sourceNodeId: spec.table.id,
      sourcePortId: 'selected-row',
      targetNodeId: spec.detail.id,
      targetPortId: 'row',
    });
  }

  nodes.push(
    registry.createNode('infra.postgresql', {
      id: pgId,
      label: `PostgreSQL · ${spec.postgresTable}`,
      layout: { x: CONTENT_WIDTH + MARGIN + 16, y: MARGIN, width: 220, height: 96 },
      properties: mergeNodeProperties(
        {
          connectionEnvKey: 'DATABASE_URL',
          table: spec.postgresTable,
        },
        'Rowset source for table and chart bindings',
        dataSource,
      ),
    }),
  );

  bindings.push(
    {
      id: `${spec.templateId}-pg-table`,
      sourceNodeId: pgId,
      sourcePortId: 'rowset',
      targetNodeId: spec.table.id,
      targetPortId: 'data',
    },
    {
      id: `${spec.templateId}-pg-chart`,
      sourceNodeId: pgId,
      sourcePortId: 'rowset',
      targetNodeId: spec.chart.id,
      targetPortId: 'data',
    },
  );

  if (bindsTimeFilter(spec.filter.type)) {
    bindings.push(
      {
        id: `${spec.templateId}-filter-table`,
        sourceNodeId: spec.filter.id,
        sourcePortId: 'range',
        targetNodeId: spec.table.id,
        targetPortId: 'filter',
      },
      {
        id: `${spec.templateId}-filter-chart`,
        sourceNodeId: spec.filter.id,
        sourcePortId: 'range',
        targetNodeId: spec.chart.id,
        targetPortId: 'range',
      },
    );
  }

  return {
    id: options.id ?? crypto.randomUUID(),
    name: spec.name,
    description: spec.description,
    templateId: spec.templateId,
    version: options.version ?? 1,
    nodes,
    bindings,
    exportTargets: {
      ui: 'react',
      server: 'nest',
      database: 'postgresql',
    },
  };
}
