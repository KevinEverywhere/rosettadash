import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import type { Composite } from '../model/types';
import {
  buildDashboardStarterComposite,
  type DashboardStarterSpec,
} from './build-dashboard-starter';
import {
  DEV_APM_OVERVIEW_TEMPLATE_ID,
  DEV_CICD_PIPELINE_TEMPLATE_ID,
  DEV_INFRA_MONITOR_TEMPLATE_ID,
  MEDIA_CAMPAIGN_ROI_TEMPLATE_ID,
  MEDIA_SOCIAL_CONTENT_TEMPLATE_ID,
  MEDIA_WEB_SEO_TEMPLATE_ID,
  OFFICE_EXECUTIVE_KPI_TEMPLATE_ID,
  OFFICE_PROJECT_SPRINT_TEMPLATE_ID,
  OFFICE_SALES_PIPELINE_TEMPLATE_ID,
  OFFICE_SUPPORT_DESK_TEMPLATE_ID,
} from './dashboard-starter-template-ids';
import type { BuildCompositeTemplateOptions } from './template-types';

export const DASHBOARD_STARTER_SPECS: DashboardStarterSpec[] = [
  {
    templateId: MEDIA_SOCIAL_CONTENT_TEMPLATE_ID,
    name: 'Social & Content Performance',
    description:
      'Track reach, engagement, and top posts across X, LinkedIn, Meta, and TikTok.',
    postgresTable: 'social_content',
    dataSourceLabel: 'Social analytics API · Meltwater / native channel exports',
    filter: {
      id: 'channel-filter',
      label: 'Social Channel',
      type: 'visual.input.select',
      subtitle: 'Filter posts and KPIs by publishing channel',
      properties: { placeholder: 'All channels' },
    },
    kpis: [
      {
        id: 'kpi-engagement-rate',
        label: 'Engagement Rate',
        title: 'Engagement rate',
        format: 'percent',
        subtitle: 'Likes + comments + shares ÷ reach · vs prior 7 days',
      },
      {
        id: 'kpi-reach',
        label: 'Total Reach',
        title: 'Reach',
        format: 'number',
        subtitle: 'Unique accounts reached in selected period',
      },
    ],
    table: {
      id: 'content-table',
      label: 'Top Content',
      subtitle: 'Columns: post, channel, impressions, engagement, published',
      pageSize: 15,
    },
    chart: {
      id: 'engagement-chart',
      label: 'Engagement by Post',
      type: 'visual.chart.bar',
      title: 'Engagement by post',
      subtitle: 'Compare post-level engagement for the filtered channel',
    },
  },
  {
    templateId: MEDIA_WEB_SEO_TEMPLATE_ID,
    name: 'Web Traffic & SEO',
    description:
      'Monitor page views, bounce rate, landing pages, and organic keyword movement.',
    postgresTable: 'web_pages',
    dataSourceLabel: 'Google Analytics 4 · Search Console export',
    filter: {
      id: 'date-range',
      label: 'Reporting Period',
      type: 'visual.input.date-range',
      subtitle: 'Aligns table rows and rank trend chart',
      properties: { preset: 'last-30-days' },
    },
    kpis: [
      {
        id: 'traffic-kpis-views',
        label: 'Page Views',
        title: 'Page views',
        format: 'number',
        subtitle: 'All properties · selected date range',
      },
      {
        id: 'traffic-kpis-bounce',
        label: 'Bounce Rate',
        title: 'Bounce rate',
        format: 'percent',
        subtitle: 'Single-page sessions without interaction',
      },
    ],
    table: {
      id: 'pages-table',
      label: 'Landing Pages',
      subtitle: 'Columns: page, views, avg session, bounce, top query',
      pageSize: 20,
    },
    chart: {
      id: 'rank-chart',
      label: 'Organic Rank Trend',
      type: 'visual.chart.line',
      title: 'Average keyword position',
      subtitle: 'Weighted average position for tracked SEO keywords',
    },
  },
  {
    templateId: MEDIA_CAMPAIGN_ROI_TEMPLATE_ID,
    name: 'Paid Media & Campaign ROI',
    description: 'Ad spend, ROAS, and channel mix across paid social and search campaigns.',
    postgresTable: 'campaigns',
    dataSourceLabel: 'Meta Ads · Google Ads · LinkedIn Campaign Manager',
    filter: {
      id: 'campaign-filter',
      label: 'Campaign',
      type: 'visual.input.select',
      subtitle: 'Drill into a single campaign or compare all active',
      properties: { placeholder: 'All campaigns' },
    },
    kpis: [
      {
        id: 'spend-kpis-spend',
        label: 'Ad Spend',
        title: 'Ad spend',
        format: 'currency',
        subtitle: 'Total media spend in selected period',
      },
      {
        id: 'spend-kpis-roas',
        label: 'ROAS',
        title: 'Return on ad spend',
        format: 'percent',
        subtitle: 'Revenue attributed ÷ ad spend',
      },
    ],
    table: {
      id: 'campaigns-table',
      label: 'Campaign Performance',
      subtitle: 'Columns: campaign, channel, spend, impressions, CTR, conversions',
      pageSize: 15,
    },
    chart: {
      id: 'channel-chart',
      label: 'Spend by Channel',
      type: 'visual.chart.pie',
      title: 'Spend by channel',
      subtitle: 'Share of budget across paid channels',
    },
  },
  {
    templateId: DEV_INFRA_MONITOR_TEMPLATE_ID,
    name: 'Infrastructure Monitoring',
    description: 'CPU, memory, disk, and network health for hosts and cloud instances.',
    postgresTable: 'hosts',
    dataSourceLabel: 'Prometheus · Grafana Cloud · Datadog host metrics',
    filter: {
      id: 'time-preset',
      label: 'Time Window',
      type: 'domain.time-preset',
      subtitle: 'Roll up host metrics for the selected period',
      properties: { defaultPreset: 'last-7-days', label: 'Period' },
    },
    kpis: [
      {
        id: 'resource-kpis-cpu',
        label: 'CPU Utilization',
        title: 'CPU utilization',
        format: 'percent',
        subtitle: 'Fleet-wide p95 CPU · alert threshold 85%',
      },
      {
        id: 'resource-kpis-memory',
        label: 'Memory Utilization',
        title: 'Memory utilization',
        format: 'percent',
        subtitle: 'Fleet-wide p95 memory · alert threshold 90%',
      },
    ],
    table: {
      id: 'hosts-table',
      label: 'Host Inventory',
      subtitle: 'Columns: host, region, CPU%, memory%, disk I/O, status',
      pageSize: 20,
    },
    chart: {
      id: 'utilization-chart',
      label: 'Utilization Trend',
      type: 'visual.chart.line',
      title: 'Resource utilization over time',
      subtitle: 'CPU and memory trend for selected hosts',
    },
  },
  {
    templateId: DEV_APM_OVERVIEW_TEMPLATE_ID,
    name: 'Application Performance (APM)',
    description: 'Latency, error rates, slow endpoints, and trace detail for services.',
    postgresTable: 'endpoints',
    dataSourceLabel: 'OpenTelemetry · Dynatrace · Sentry performance',
    filter: {
      id: 'service-filter',
      label: 'Service',
      type: 'visual.input.select',
      subtitle: 'Scope endpoints and errors to one microservice',
      properties: { placeholder: 'All services' },
    },
    kpis: [
      {
        id: 'latency-kpis-p95',
        label: 'P95 Latency',
        title: 'P95 latency (ms)',
        format: 'number',
        subtitle: '95th percentile response time · SLO 300ms',
      },
      {
        id: 'latency-kpis-errors',
        label: 'Error Rate',
        title: 'HTTP 5xx rate',
        format: 'percent',
        subtitle: 'Failed requests ÷ total requests',
      },
    ],
    table: {
      id: 'endpoints-table',
      label: 'Slow Endpoints',
      subtitle: 'Columns: route, RPS, p95, p99, error%, last deploy',
      pageSize: 20,
    },
    chart: {
      id: 'errors-chart',
      label: 'Errors by Endpoint',
      type: 'visual.chart.bar',
      title: 'Errors by endpoint',
      subtitle: 'Top endpoints by 5xx count in the selected window',
    },
    detail: {
      id: 'trace-detail',
      label: 'Trace Detail',
      title: 'Stack trace & span summary',
      subtitle: 'Bind from selected endpoint row · shows exemplar trace',
    },
  },
  {
    templateId: DEV_CICD_PIPELINE_TEMPLATE_ID,
    name: 'CI/CD Pipeline',
    description: 'Build success, pipeline duration, and deployment frequency by environment.',
    postgresTable: 'builds',
    dataSourceLabel: 'GitHub Actions · GitLab CI · Jenkins / ArgoCD',
    filter: {
      id: 'env-filter',
      label: 'Environment',
      type: 'visual.input.select',
      subtitle: 'Staging vs production pipeline runs',
      properties: { placeholder: 'All environments' },
    },
    kpis: [
      {
        id: 'pipeline-kpis-success',
        label: 'Build Success',
        title: 'Build success rate',
        format: 'percent',
        subtitle: 'Green builds ÷ total pipeline runs',
      },
      {
        id: 'pipeline-kpis-frequency',
        label: 'Deploy Frequency',
        title: 'Deploys per week',
        format: 'number',
        subtitle: 'DORA metric · production deployments',
      },
    ],
    table: {
      id: 'builds-table',
      label: 'Recent Builds',
      subtitle: 'Columns: pipeline, branch, duration, status, commit, deployed at',
      pageSize: 20,
    },
    chart: {
      id: 'deploy-chart',
      label: 'Deployment Frequency',
      type: 'visual.chart.line',
      title: 'Deployments over time',
      subtitle: 'Weekly deploy count trend by environment',
    },
  },
  {
    templateId: OFFICE_PROJECT_SPRINT_TEMPLATE_ID,
    name: 'Project & Sprint Tracker',
    description: 'Sprint velocity, burndown, and ticket health for agile teams.',
    postgresTable: 'tickets',
    dataSourceLabel: 'Jira · Linear · ClickUp sprint export',
    filter: {
      id: 'sprint-preset',
      label: 'Sprint',
      type: 'domain.time-preset',
      subtitle: 'Current or recent sprint timebox',
      properties: { label: 'Sprint', defaultPreset: 'last-7-days' },
    },
    kpis: [
      {
        id: 'velocity-kpi',
        label: 'Sprint Velocity',
        title: 'Story points completed',
        format: 'number',
        subtitle: 'Committed vs completed points this sprint',
      },
      {
        id: 'velocity-kpi-open',
        label: 'Open Tickets',
        title: 'Open tickets',
        format: 'number',
        subtitle: 'In progress + blocked · excludes done',
      },
    ],
    table: {
      id: 'tickets-table',
      label: 'Sprint Backlog',
      subtitle: 'Columns: ticket, assignee, status, points, cycle time',
      pageSize: 25,
    },
    chart: {
      id: 'burndown-chart',
      label: 'Burndown',
      type: 'visual.chart.line',
      title: 'Sprint burndown',
      subtitle: 'Remaining story points vs ideal burndown line',
    },
  },
  {
    templateId: OFFICE_SALES_PIPELINE_TEMPLATE_ID,
    name: 'Sales Pipeline',
    description: 'Pipeline revenue, win rate, and deals by stage for revenue teams.',
    postgresTable: 'deals',
    dataSourceLabel: 'Salesforce · HubSpot CRM export',
    filter: {
      id: 'stage-filter',
      label: 'Pipeline Stage',
      type: 'visual.input.select',
      subtitle: 'Qualification through closed-won/lost',
      properties: { placeholder: 'All stages' },
    },
    kpis: [
      {
        id: 'revenue-kpis-revenue',
        label: 'Pipeline Revenue',
        title: 'Open pipeline',
        format: 'currency',
        subtitle: 'Weighted amount in active opportunities',
      },
      {
        id: 'revenue-kpis-win-rate',
        label: 'Win Rate',
        title: 'Win rate',
        format: 'percent',
        subtitle: 'Closed-won ÷ (won + lost) this quarter',
      },
    ],
    table: {
      id: 'deals-table',
      label: 'Active Deals',
      subtitle: 'Columns: account, stage, amount, owner, close date, probability',
      pageSize: 20,
    },
    chart: {
      id: 'pipeline-chart',
      label: 'Pipeline by Stage',
      type: 'visual.chart.bar',
      title: 'Deals by stage',
      subtitle: 'Count and value stacked by pipeline stage',
    },
  },
  {
    templateId: OFFICE_SUPPORT_DESK_TEMPLATE_ID,
    name: 'Customer Support Desk',
    description: 'Queue volume, SLA response times, and ticket detail for support teams.',
    postgresTable: 'support_tickets',
    dataSourceLabel: 'Zendesk · Intercom · Freshdesk API',
    filter: {
      id: 'queue-filter',
      label: 'Support Queue',
      type: 'visual.input.select',
      subtitle: 'Billing, technical, or tier-1 queues',
      properties: { placeholder: 'All queues' },
    },
    kpis: [
      {
        id: 'sla-kpis-open',
        label: 'Open Tickets',
        title: 'Open tickets',
        format: 'number',
        subtitle: 'Awaiting agent response or customer reply',
      },
      {
        id: 'sla-kpis-response',
        label: 'Avg First Response',
        title: 'Avg first response (hrs)',
        format: 'number',
        subtitle: 'SLA target 4h · breach count in table',
      },
    ],
    table: {
      id: 'tickets-table',
      label: 'Ticket Queue',
      subtitle: 'Columns: ticket, customer, priority, status, wait time, CSAT',
      pageSize: 20,
    },
    chart: {
      id: 'sla-chart',
      label: 'Tickets by Priority',
      type: 'visual.chart.bar',
      title: 'Open tickets by priority',
      subtitle: 'P1–P4 distribution for selected queue',
    },
    detail: {
      id: 'ticket-detail',
      label: 'Ticket Detail',
      title: 'Conversation & resolution',
      subtitle: 'Selected row shows subject, thread summary, and SLA clock',
    },
  },
  {
    templateId: OFFICE_EXECUTIVE_KPI_TEMPLATE_ID,
    name: 'Executive KPI Overview',
    description: 'Cross-functional KPIs — revenue, margin, and headcount for leadership.',
    postgresTable: 'executive_metrics',
    dataSourceLabel: 'Finance ERP · HRIS · consolidated BI warehouse',
    filter: {
      id: 'date-range',
      label: 'Fiscal Period',
      type: 'visual.input.date-range',
      subtitle: 'Quarter-to-date default · rolls up summary table',
      properties: { preset: 'qtd' },
    },
    kpis: [
      {
        id: 'executive-kpis-revenue',
        label: 'Revenue',
        title: 'Revenue',
        format: 'currency',
        subtitle: 'Recognized revenue · vs plan',
      },
      {
        id: 'executive-kpis-margin',
        label: 'Gross Margin',
        title: 'Gross margin',
        format: 'percent',
        subtitle: 'Operating margin after COGS',
      },
      {
        id: 'executive-kpis-headcount',
        label: 'Headcount',
        title: 'Headcount',
        format: 'number',
        subtitle: 'Full-time employees · open reqs excluded',
      },
    ],
    table: {
      id: 'summary-table',
      label: 'KPI Summary',
      subtitle: 'Columns: metric, actual, plan, variance, owner',
      pageSize: 12,
    },
    chart: {
      id: 'trend-chart',
      label: 'KPI Trend',
      type: 'visual.chart.line',
      title: 'Executive KPI trend',
      subtitle: 'Trailing periods for revenue, margin, and headcount',
    },
  },
];

const specById = new Map(DASHBOARD_STARTER_SPECS.map((spec) => [spec.templateId, spec]));

export function buildDashboardStarterById(
  templateId: string,
  registry: ComponentRegistry = defaultComponentRegistry,
  options: BuildCompositeTemplateOptions = {},
): Composite {
  const spec = specById.get(templateId);
  if (!spec) {
    throw new Error(`Unknown dashboard starter template: ${templateId}`);
  }
  return buildDashboardStarterComposite(spec, registry, options);
}

export function listDashboardStarterSpecs(): Pick<
  DashboardStarterSpec,
  'templateId' | 'name' | 'description'
>[] {
  return DASHBOARD_STARTER_SPECS.map(({ templateId, name, description }) => ({
    templateId,
    name,
    description,
  }));
}
