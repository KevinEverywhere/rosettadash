import type { ComponentGroupingGuide, InstructionStep } from './types';

type InstructionEnrichment = Partial<
  Pick<ComponentGroupingGuide, 'steps' | 'outcomeSummary' | 'animationBlocks' | 'animationKey'>
> & {
  steps: NonNullable<ComponentGroupingGuide['steps']>;
  outcomeSummary: string;
  animationBlocks: string[];
};

const INSTRUCTION_ENRICHMENTS: Record<string, InstructionEnrichment> = {
  'visual.input.date-range': {
    animationBlocks: ['Date Range', 'Data Table'],
    outcomeSummary: 'A time window control that drives scoped queries on tables and charts.',
    steps: [
      {
        order: 1,
        title: 'Add the filter',
        body: 'Place Date Range at the top of your dashboard layout.',
        highlight: 'source',
      },
      {
        order: 2,
        title: 'Pick a preset',
        body: 'Choose Last 7 days, Last 30 days, or Custom in the inspector.',
      },
      {
        order: 3,
        title: 'Add a consumer',
        body: 'Add a Data Table or Line Chart below the filter.',
        highlight: 'target',
      },
      {
        order: 4,
        title: 'Bind the range',
        body: 'Connect date-range.value → table.filterRange (or the chart equivalent).',
        highlight: 'bind',
      },
      {
        order: 5,
        title: 'Preview',
        body: 'Switch to Preview mode; changing the range refreshes bound components.',
      },
    ],
  },
  'visual.table': {
    animationBlocks: ['Date Range', 'Data Table', 'Detail'],
    outcomeSummary: 'Sortable tabular view fed by filters and optional database infra.',
    steps: [
      {
        order: 1,
        title: 'Add a table',
        body: 'Place Data Table in the main content area.',
        highlight: 'source',
      },
      {
        order: 2,
        title: 'Add a time filter',
        body: 'Date Range or Time Preset above the table.',
        highlight: 'target',
      },
      {
        order: 3,
        title: 'Bind the filter',
        body: 'Connect filter output to the table filter input port.',
        highlight: 'bind',
      },
      {
        order: 4,
        title: 'Add data source',
        body: 'PostgreSQL node for export wiring; preview uses mock API data.',
      },
      {
        order: 5,
        title: 'Enable drill-down',
        body: 'Add Detail panel; bind table.selectedRow → detail.row.',
        highlight: 'bind',
      },
    ],
  },
  'visual.kpi': {
    animationBlocks: ['PostgreSQL', 'KPI Card'],
    outcomeSummary: 'Single metric with delta indicator.',
    steps: [
      {
        order: 1,
        title: 'Add a KPI',
        body: 'Place KPI card in a header row or stat group.',
        highlight: 'source',
      },
      {
        order: 2,
        title: 'Set labels',
        body: 'Title and value format in the inspector.',
      },
      {
        order: 3,
        title: 'Connect data',
        body: 'Bind from Table aggregate or PostgreSQL-backed hook in export.',
        highlight: 'bind',
      },
      {
        order: 4,
        title: 'Add context',
        body: 'Pair with Date Range so the metric respects the selected period.',
        highlight: 'target',
      },
      {
        order: 5,
        title: 'Preview',
        body: 'Confirm mock KPI value updates with preview data.',
      },
    ],
  },
  'visual.chart.line': {
    animationBlocks: ['Date Range', 'Line Chart'],
    outcomeSummary: 'Time-series visualization.',
    steps: [
      {
        order: 1,
        title: 'Add the chart',
        body: 'Place Line Chart in the canvas center or right column.',
        highlight: 'source',
      },
      {
        order: 2,
        title: 'Add Date Range',
        body: 'Filters define the X-axis time window.',
        highlight: 'target',
      },
      {
        order: 3,
        title: 'Bind the filter',
        body: 'Connect range output to chart filter input.',
        highlight: 'bind',
      },
      {
        order: 4,
        title: 'Configure fields',
        body: 'Set label and value field names to match rowset columns.',
      },
      {
        order: 5,
        title: 'Add table',
        body: 'Optional table below chart for drill-down on points.',
        highlight: 'target',
      },
    ],
  },
  'visual.chart.bar': {
    animationBlocks: ['Date Range', 'Bar Chart', 'KPI'],
    outcomeSummary: 'Category comparison chart.',
    steps: [
      {
        order: 1,
        title: 'Add bar chart',
        body: 'Place in dashboard body.',
        highlight: 'source',
      },
      {
        order: 2,
        title: 'Add filter',
        body: 'Date Range or Time Preset for period scoping.',
        highlight: 'target',
      },
      {
        order: 3,
        title: 'Bind filter',
        body: 'Connect to chart filter port.',
        highlight: 'bind',
      },
      {
        order: 4,
        title: 'Add KPIs',
        body: 'One or two KPI cards above for headline metrics.',
        highlight: 'target',
      },
      {
        order: 5,
        title: 'Tune categories',
        body: 'Set category field in inspector to match rowset.',
      },
    ],
  },
  'visual.detail': {
    animationBlocks: ['Data Table', 'Detail Panel'],
    outcomeSummary: 'Key-value panel for selected table row.',
    steps: [
      {
        order: 1,
        title: 'Add a table first',
        body: 'Detail needs a row source.',
        highlight: 'target',
      },
      {
        order: 2,
        title: 'Add Detail panel',
        body: 'Place adjacent to or below the table.',
        highlight: 'source',
      },
      {
        order: 3,
        title: 'Bind selection',
        body: 'Connect table.selectedRow → detail.row.',
        highlight: 'bind',
      },
      {
        order: 4,
        title: 'Configure fields',
        body: 'Choose which columns appear as detail keys.',
      },
      {
        order: 5,
        title: 'Preview',
        body: 'Click a table row; detail panel populates.',
      },
    ],
  },
  'domain.time-preset': {
    animationBlocks: ['Time Preset', 'Data Table'],
    outcomeSummary: 'One-click Last 7d / QTD / YTD buttons driving filter bindings.',
    steps: [
      {
        order: 1,
        title: 'Add Time Preset',
        body: 'Compact alternative to full Date Range picker.',
        highlight: 'source',
      },
      {
        order: 2,
        title: 'Add consumer',
        body: 'Table or chart that accepts a filter range input.',
        highlight: 'target',
      },
      {
        order: 3,
        title: 'Bind output',
        body: 'Connect preset range to consumer filter port.',
        highlight: 'bind',
      },
      {
        order: 4,
        title: 'Set default',
        body: 'Choose initial preset in inspector.',
      },
      {
        order: 5,
        title: 'Preview',
        body: 'Click presets; bound components update.',
      },
    ],
  },
  'infra.postgresql': {
    animationKey: 'server-data',
    animationBlocks: ['NestJS Server', 'PostgreSQL', 'Data Table'],
    outcomeSummary: 'Invisible node exporting connection config and env templates.',
    steps: [
      {
        order: 1,
        title: 'Add PostgreSQL',
        body: 'Infrastructure node (not rendered in UI preview).',
        highlight: 'source',
      },
      {
        order: 2,
        title: 'Add server partner',
        body: 'NestJS, Express, Next, or Nuxt infra node for API layer.',
        highlight: 'target',
      },
      {
        order: 3,
        title: 'Add visual consumer',
        body: 'Data Table or KPI that reads from the database in export.',
        highlight: 'target',
      },
      {
        order: 4,
        title: 'Bind data ports',
        body: 'Wire infra outputs to visual data inputs per export IR rules.',
        highlight: 'bind',
      },
      {
        order: 5,
        title: 'Export',
        body: 'Download zip includes .env.example with DATABASE_URL placeholder.',
      },
    ],
  },
  'visual.skeleton': {
    animationBlocks: ['Skeleton', 'Data Table'],
    outcomeSummary: 'Placeholder shimmer while data loads.',
    steps: [
      {
        order: 1,
        title: 'Add skeleton',
        body: 'Same layout region as the content it replaces.',
        highlight: 'source',
      },
      {
        order: 2,
        title: 'Add content',
        body: 'Table, chart, or KPI that appears when loaded.',
        highlight: 'target',
      },
      {
        order: 3,
        title: 'Bind loading flag',
        body: 'Connect checkbox, timer tick, or hook to skeleton.loading.',
        highlight: 'bind',
      },
      {
        order: 4,
        title: 'Match variant',
        body: 'Pick table/chart/kpi/card skeleton shape in inspector.',
      },
      {
        order: 5,
        title: 'Preview',
        body: 'Toggle loading; skeleton hides when data is ready.',
      },
    ],
  },
  'logic.timer': {
    animationBlocks: ['Timer', 'Data Table', 'KPI'],
    outcomeSummary: 'Interval or countdown driving polling refresh.',
    steps: [
      {
        order: 1,
        title: 'Add Timer',
        body: 'Logic node with minimal preview UI.',
        highlight: 'source',
      },
      {
        order: 2,
        title: 'Set mode',
        body: 'Interval or countdown in inspector.',
      },
      {
        order: 3,
        title: 'Add data visuals',
        body: 'Table, KPI, or chart to refresh.',
        highlight: 'target',
      },
      {
        order: 4,
        title: 'Bind tick',
        body: 'Connect timer.tick or timer.elapsed to refresh trigger ports.',
        highlight: 'bind',
      },
      {
        order: 5,
        title: 'Preview',
        body: 'Watch components update on each tick.',
      },
    ],
  },
};

export const INSTRUCTION_GUIDE_TYPES = Object.keys(INSTRUCTION_ENRICHMENTS);

export function getInstructionEnrichment(type: string): InstructionEnrichment | undefined {
  return INSTRUCTION_ENRICHMENTS[type];
}

export function mergeInstructionGuide(guide: ComponentGroupingGuide): ComponentGroupingGuide {
  const enrichment = getInstructionEnrichment(guide.type);
  if (!enrichment) {
    return guide;
  }
  return { ...guide, ...enrichment };
}

export function getInstructionSteps(type: string): InstructionStep[] {
  const enrichment = getInstructionEnrichment(type);
  return enrichment?.steps ? [...enrichment.steps].sort((a, b) => a.order - b.order) : [];
}

export function hasInstructionGuide(type: string): boolean {
  return getInstructionSteps(type).length >= 3;
}
