import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import type { Composite } from '../model/types';
import { ANALYTICS_OVERVIEW_TEMPLATE_ID } from './template-ids';
import type { BuildCompositeTemplateOptions } from './template-types';

export function buildAnalyticsOverviewComposite(
  registry: ComponentRegistry = defaultComponentRegistry,
  options: BuildCompositeTemplateOptions = {},
): Composite {
  const dateRange = registry.createNode('visual.input.date-range', {
    id: 'analytics-date-range',
    label: 'Date range',
    layout: { x: 24, y: 24, width: 280, height: 88 },
    properties: { preset: 'last-7-days' },
  });

  const kpiRevenue = registry.createNode('visual.kpi', {
    id: 'analytics-kpi-revenue',
    label: 'Revenue',
    layout: { x: 24, y: 128, width: 200, height: 96 },
    properties: { title: 'Revenue', format: 'currency' },
  });

  const kpiOrders = registry.createNode('visual.kpi', {
    id: 'analytics-kpi-orders',
    label: 'Orders',
    layout: { x: 240, y: 128, width: 200, height: 96 },
    properties: { title: 'Orders', format: 'number' },
  });

  const table = registry.createNode('visual.table', {
    id: 'analytics-table',
    label: 'Sales table',
    layout: { x: 24, y: 240, width: 416, height: 160 },
    properties: { pageSize: 25 },
  });

  const chart = registry.createNode('visual.chart.line', {
    id: 'analytics-chart',
    label: 'Trend chart',
    layout: { x: 24, y: 416, width: 416, height: 160 },
    properties: { title: 'Sales trend', xField: 'date', yField: 'value' },
  });

  const postgres = registry.createNode('infra.postgresql', {
    id: 'analytics-pg',
    properties: { connectionEnvKey: 'DATABASE_URL', table: 'sales' },
  });

  const server = registry.createNode('infra.server.nest', {
    id: 'analytics-server',
    properties: { globalPrefix: 'api' },
  });

  return {
    id: options.id ?? crypto.randomUUID(),
    name: 'Analytics overview',
    description: 'Date-filtered KPIs, table, and line chart wired to PostgreSQL.',
    templateId: ANALYTICS_OVERVIEW_TEMPLATE_ID,
    version: options.version ?? 1,
    nodes: [dateRange, kpiRevenue, kpiOrders, table, chart, postgres, server],
    bindings: [
      {
        id: 'analytics-b1',
        sourceNodeId: 'analytics-pg',
        sourcePortId: 'rowset',
        targetNodeId: 'analytics-table',
        targetPortId: 'data',
      },
      {
        id: 'analytics-b2',
        sourceNodeId: 'analytics-pg',
        sourcePortId: 'rowset',
        targetNodeId: 'analytics-chart',
        targetPortId: 'data',
      },
      {
        id: 'analytics-b3',
        sourceNodeId: 'analytics-date-range',
        sourcePortId: 'range',
        targetNodeId: 'analytics-table',
        targetPortId: 'filter',
      },
      {
        id: 'analytics-b4',
        sourceNodeId: 'analytics-date-range',
        sourcePortId: 'range',
        targetNodeId: 'analytics-chart',
        targetPortId: 'range',
      },
    ],
    exportTargets: {
      ui: 'react',
      server: 'nest',
      database: 'postgresql',
    },
  };
}
