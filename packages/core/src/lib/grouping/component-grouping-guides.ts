import type {
  CompanionLayoutOptions,
  CompanionPlacement,
  ComponentGroupingGuide,
  GroupingAnimationKey,
  InstructionStep,
  ResolvedCompanionLayout,
} from './types';
import type { NodeLayout } from '../model/types';
import { mergeInstructionGuide } from './component-instruction-guides';

const GROUPING_GUIDES: ComponentGroupingGuide[] = [
  {
    type: 'visual.input.date-range',
    summary: 'Time filter that drives scoped queries on tables and charts.',
    animationKey: 'filter-table',
    companionTypes: ['visual.table', 'visual.chart.line'],
    placementMessage: 'Bind the range output to table or chart filter inputs.',
  },
  {
    type: 'domain.time-preset',
    summary: 'Relative period shortcuts — drives the same bindings as date range.',
    animationKey: 'filter-table',
    companionTypes: ['visual.table', 'visual.chart.line'],
    placementMessage: 'Bind the range output to table or chart filter inputs.',
  },
  {
    type: 'visual.table',
    summary: 'Tabular data view — usually paired with a filter and data source.',
    animationKey: 'filter-table',
    companionTypes: ['visual.input.date-range', 'domain.time-preset', 'infra.postgresql', 'visual.detail', 'visual.skeleton'],
    placementMessage: 'Add a time filter and PostgreSQL source for a complete data flow.',
  },
  {
    type: 'visual.detail',
    summary: 'Row drill-down panel — bind to a table selected-row output.',
    animationKey: 'filter-table',
    companionTypes: ['visual.table'],
    placementMessage: 'Add a Data Table and bind its selected row output to this panel.',
  },
  {
    type: 'visual.skeleton',
    summary: 'Loading placeholder — pair with tables, charts, or KPIs while data fetches.',
    animationKey: 'data-stack',
    companionTypes: ['visual.table', 'visual.chart.line', 'visual.kpi', 'infra.postgresql'],
    placementMessage: 'Bind the loading input to a data hook or toggle while content loads.',
  },
  {
    type: 'logic.timer',
    summary: 'Interval or countdown ticks — drive refresh triggers and polling loops.',
    animationKey: 'data-stack',
    companionTypes: ['visual.table', 'visual.kpi', 'visual.chart.line'],
    placementMessage: 'Bind tick or elapsed outputs to refresh data-bound components.',
  },
  {
    type: 'visual.chart.line',
    summary: 'Time-series chart — works best with a date range and rowset data.',
    animationKey: 'filter-chart',
    companionTypes: ['visual.input.date-range', 'domain.time-preset', 'visual.table'],
    placementMessage: 'Add a Date Range and optionally a Table for drill-down.',
  },
  {
    type: 'visual.chart.bar',
    summary: 'Category comparison chart — often grouped with filters and KPIs.',
    animationKey: 'filter-chart',
    companionTypes: ['visual.input.date-range', 'domain.time-preset', 'visual.kpi'],
    placementMessage: 'Add a Date Range filter and KPI cards for dashboard context.',
  },
  {
    type: 'visual.chart.pie',
    summary: 'Part-to-whole breakdown — pair with filters and KPI context.',
    animationKey: 'filter-chart',
    companionTypes: ['visual.input.date-range', 'domain.time-preset', 'visual.kpi'],
    placementMessage: 'Add a Date Range filter and KPI cards for dashboard context.',
  },
  {
    type: 'visual.display.3d-bar-chart',
    summary: '3D categorical chart — bind table rowset data and orbit to explore.',
    animationKey: 'filter-chart',
    companionTypes: ['visual.input.date-range', 'domain.time-preset', 'visual.table'],
    placementMessage: 'Add a Data Table and bind its rowset to the 3D bar chart.',
  },
  {
    type: 'visual.display.3d-scatter',
    summary: '3D scatter plot — map rowset fields to X, Y, and Z axes.',
    animationKey: 'filter-chart',
    companionTypes: ['visual.table', 'visual.input.date-range'],
    placementMessage: 'Bind a table rowset and configure x/y/z field names.',
  },
  {
    type: 'visual.display.3d-scene',
    summary: 'Spatial orbit scene — host for 3D dashboard layouts.',
    animationKey: 'data-stack',
    companionTypes: ['visual.table', 'visual.display.3d-bar-chart'],
    placementMessage: 'Pair with data sources or other VR visuals for spatial dashboards.',
  },
  {
    type: 'visual.display.3d-gltf-model',
    summary: 'GLTF/GLB model host — load external 3D assets with orbit controls.',
    animationKey: 'data-stack',
    companionTypes: ['visual.display.3d-scene', 'visual.kpi'],
    placementMessage: 'Set a model URL and scale; pair with KPI cards for spatial context.',
  },
  {
    type: 'visual.display.3d-geo-globe',
    summary: 'Geo globe — plot rowset lat/lng markers on an orbiting Earth sphere.',
    animationKey: 'filter-chart',
    companionTypes: ['visual.table', 'visual.input.date-range'],
    placementMessage: 'Bind a table rowset and configure latitude/longitude field names.',
  },
  {
    type: 'visual.kpi',
    summary: 'Single metric card — typically fed by a database or table aggregate.',
    animationKey: 'data-stack',
    companionTypes: ['infra.postgresql', 'visual.table'],
    placementMessage: 'Connect a PostgreSQL source or Table for live metric data.',
  },
  {
    type: 'infra.postgresql',
    summary: 'PostgreSQL data layer — export with a server and visual consumer.',
    animationKey: 'data-stack',
    companionTypes: ['infra.server.nest', 'visual.table'],
    placementMessage: 'Add NestJS server routes and a Table to surface query results.',
  },
  {
    type: 'infra.mongodb',
    summary: 'MongoDB document store — pair with server and table components.',
    animationKey: 'data-stack',
    companionTypes: ['infra.server.nest', 'visual.table'],
    placementMessage: 'Add NestJS server and a Table for document query results.',
  },
  {
    type: 'infra.mysql',
    summary: 'MySQL relational layer — typically grouped with server and visuals.',
    animationKey: 'data-stack',
    companionTypes: ['infra.server.nest', 'visual.table'],
    placementMessage: 'Add NestJS server and a Table to display query output.',
  },
  {
    type: 'infra.supabase',
    summary: 'Supabase PostgREST layer — group with server and table visuals.',
    animationKey: 'data-stack',
    companionTypes: ['infra.server.nest', 'visual.table'],
    placementMessage: 'Add NestJS server and a Table for Supabase-backed data.',
  },
  {
    type: 'infra.server.nest',
    summary: 'NestJS API server — anchors infra stacks with database and UI consumers.',
    animationKey: 'server-data',
    companionTypes: ['infra.postgresql', 'visual.table'],
    placementMessage: 'Add PostgreSQL and a Table to complete the backend stack.',
  },
  {
    type: 'domain.role-gate',
    summary: 'Conditional UI gate — usually part of an access-control flow.',
    animationKey: 'access-flow',
    companionTypes: ['domain.role-assign', 'domain.person-invite'],
    placementMessage: 'Group with Role Assign and Person Invite for onboarding flows.',
  },
  {
    type: 'domain.role-assign',
    summary: 'Role assignment action — pairs with gates and invite steps.',
    animationKey: 'access-flow',
    companionTypes: ['domain.role-gate', 'domain.person-invite'],
    placementMessage: 'Add Role Gate and Person Invite for complete access workflows.',
  },
  {
    type: 'domain.person-invite',
    summary: 'Invite form — typically grouped with role assignment and gates.',
    animationKey: 'access-flow',
    companionTypes: ['domain.role-assign', 'domain.role-gate'],
    placementMessage: 'Add Role Assign and Role Gate for invite + access patterns.',
  },
  {
    type: 'layout.tabs',
    summary: 'Tab container — group with charts and KPIs for dashboard sections.',
    animationKey: 'filter-chart',
    companionTypes: ['visual.kpi', 'visual.chart.line'],
    placementMessage: 'Add KPI cards and charts as tab content.',
  },
  {
    type: 'layout.modal',
    summary: 'Modal dialog — often contains form inputs and actions.',
    animationKey: 'form-row',
    companionTypes: ['visual.input.text', 'visual.input.checkbox'],
    placementMessage: 'Add Text Input and Checkbox fields inside modal forms.',
  },
  {
    type: 'layout.grid',
    summary: 'Grid layout — groups KPIs and charts in dashboard rows.',
    animationKey: 'filter-chart',
    companionTypes: ['visual.kpi', 'visual.chart.bar'],
    placementMessage: 'Add KPI cards and bar charts as grid cells.',
  },
  {
    type: 'layout.flex',
    summary: 'Flex row/column — simpler layout for toolbars and form rows.',
    animationKey: 'form-row',
    companionTypes: ['visual.input.text', 'visual.kpi'],
    placementMessage: 'Add inputs or KPI cards as flex children.',
  },
  {
    type: 'visual.input.text',
    summary: 'Single-line text field for search boxes, labels, and form values.',
    animationKey: 'form-row',
    companionTypes: ['visual.input.checkbox', 'visual.input.number', 'layout.flex', 'layout.modal'],
    placementMessage: 'Group with other inputs in a flex toolbar or modal form.',
  },
  {
    type: 'visual.input.select',
    summary: 'Dropdown for choosing one option from static or data-bound lists.',
    animationKey: 'form-row',
    companionTypes: ['visual.table', 'visual.input.text', 'layout.flex'],
    placementMessage: 'Bind options from a table rowset or pair with text filters.',
  },
  {
    type: 'visual.input.number',
    summary: 'Numeric input with min, max, and step for quantities and thresholds.',
    animationKey: 'form-row',
    companionTypes: ['visual.input.text', 'visual.kpi', 'layout.flex'],
    placementMessage: 'Use beside text inputs in filter rows or KPI toolbars.',
  },
  {
    type: 'visual.input.checkbox',
    summary: 'Boolean toggle for flags, loading states, and form consent.',
    animationKey: 'form-row',
    companionTypes: ['visual.skeleton', 'visual.input.text', 'layout.modal'],
    placementMessage: 'Bind to skeleton.loading or group in modal forms.',
  },
  {
    type: 'visual.input.textarea',
    summary: 'Multi-line text for notes, descriptions, and long-form input.',
    animationKey: 'form-row',
    companionTypes: ['visual.input.text', 'layout.modal', 'domain.person-invite'],
    placementMessage: 'Place in modals or onboarding forms with related inputs.',
  },
  {
    type: 'infra.env',
    summary: 'Environment variable map — connection strings and secrets for export.',
    animationKey: 'server-data',
    companionTypes: ['infra.postgresql', 'infra.server.nest'],
    placementMessage: 'Wire env outputs to database and server infra nodes.',
  },
  {
    type: 'infra.server.express',
    summary: 'Express API server — REST routes backed by your database infra.',
    animationKey: 'server-data',
    companionTypes: ['infra.postgresql', 'visual.table'],
    placementMessage: 'Add PostgreSQL and a Table to complete the backend stack.',
  },
  {
    type: 'infra.server.next',
    summary: 'Next.js App Router API routes for PostgreSQL-backed dashboards.',
    animationKey: 'server-data',
    companionTypes: ['infra.postgresql', 'visual.table'],
    placementMessage: 'Add PostgreSQL and a Table for API + UI export.',
  },
  {
    type: 'infra.server.nuxt',
    summary: 'Nuxt server routes for PostgreSQL-backed dashboard APIs.',
    animationKey: 'server-data',
    companionTypes: ['infra.postgresql', 'visual.table'],
    placementMessage: 'Add PostgreSQL and a Table for full-stack export.',
  },
  {
    type: 'visual.plugin.status-badge',
    summary: 'Compact status pill — plugin SDK demo for custom palette items.',
    animationKey: 'data-stack',
    companionTypes: ['visual.table', 'visual.kpi', 'visual.plugin.metric-chip'],
    placementMessage: 'Pair with tables or KPI rows for status context.',
  },
  {
    type: 'visual.plugin.metric-chip',
    summary: 'Inline metric chip — plugin SDK demo for compact KPI highlights.',
    animationKey: 'data-stack',
    companionTypes: ['visual.kpi', 'visual.table', 'layout.flex'],
    placementMessage: 'Bind value from KPI or table aggregate in a flex row.',
  },
  {
    type: 'visual.svg.inline',
    summary: 'Inline or linked SVG graphics with optional row-driven fill color.',
    animationKey: 'data-stack',
    companionTypes: ['visual.table', 'visual.kpi', 'visual.svg.icon'],
    placementMessage: 'Place beside KPIs or bind fill color from a table row field.',
  },
  {
    type: 'visual.svg.icon',
    summary: 'Compact SVG icon with configurable size and color.',
    animationKey: 'data-stack',
    companionTypes: ['visual.svg.inline', 'visual.kpi', 'layout.flex'],
    placementMessage: 'Use in flex rows or pair with inline SVG for status visuals.',
  },
  {
    type: 'infra.wasm.asset',
    summary: 'Pin a WASM binary and glue script from the content library.',
    animationKey: 'server-data',
    companionTypes: ['visual.wasm.worker-host', 'visual.wasm.module', 'visual.wasm.media'],
    placementMessage: 'Add before worker or module hosts that consume the asset reference.',
  },
  {
    type: 'visual.wasm.worker-host',
    summary: 'Run WASM inside a dedicated Web Worker with progress events.',
    animationKey: 'data-stack',
    companionTypes: ['infra.wasm.asset', 'visual.wasm.module', 'visual.wasm.media'],
    placementMessage: 'Bind a WASM asset ref and pair with compute or media components.',
  },
  {
    type: 'visual.wasm.module',
    summary: 'Invoke a WASM export with typed payload I/O.',
    animationKey: 'data-stack',
    companionTypes: ['infra.wasm.asset', 'visual.wasm.worker-host', 'visual.table'],
    placementMessage: 'Connect asset ref and route results to tables or KPIs.',
  },
  {
    type: 'visual.wasm.media',
    summary: 'ffmpeg.wasm media host — transcode or extract equirect subsections with crop + scale.',
    animationKey: 'filter-table',
    companionTypes: [
      'visual.media.video-source',
      'visual.media.equirect-viewport',
      'infra.wasm.asset',
      'visual.table',
    ],
    placementMessage:
      'Bind video source + crop region; route output metadata to a results table.',
  },
  {
    type: 'visual.media.video-source',
    summary: 'Upload or link equirectangular video for downstream WASM media processing.',
    animationKey: 'filter-table',
    companionTypes: [
      'visual.media.equirect-viewport',
      'visual.media.live-capture',
      'visual.wasm.media',
    ],
    placementMessage: 'Place above equirect viewport and WASM media extract components.',
  },
  {
    type: 'visual.media.equirect-viewport',
    summary: 'Pick a 1080×720 region on a 4096×2048 equirect frame; output 720×480.',
    animationKey: 'filter-table',
    companionTypes: ['visual.media.video-source', 'visual.wasm.media'],
    placementMessage: 'Bind crop region output to WASM media equirect-extract input.',
  },
  {
    type: 'visual.media.live-capture',
    summary: 'Live camera capture during authoring to feed video-source preview.',
    animationKey: 'form-row',
    companionTypes: ['visual.media.video-source', 'visual.media.equirect-viewport'],
    placementMessage: 'Optional during authoring; bind capture blob to video source.',
  },
  {
    type: 'visual.news.language-select',
    summary: 'Language filter for news discovery dashboards.',
    animationKey: 'form-row',
    companionTypes: [
      'visual.news.region-select',
      'visual.news.type-select',
      'visual.news.search-box',
    ],
    placementMessage: 'Place language, region, and type filters in a row above search.',
  },
  {
    type: 'visual.news.region-select',
    summary: 'Region or country filter for localized headlines.',
    animationKey: 'form-row',
    companionTypes: [
      'visual.news.language-select',
      'visual.news.type-select',
      'visual.news.search-box',
    ],
    placementMessage: 'Group with language and news-type selectors above the search box.',
  },
  {
    type: 'visual.news.type-select',
    summary: 'Category filter — headlines, business, tech, sports, science.',
    animationKey: 'form-row',
    companionTypes: [
      'visual.news.language-select',
      'visual.news.region-select',
      'visual.news.search-box',
    ],
    placementMessage: 'Place beside language and region filters before search.',
  },
  {
    type: 'visual.news.search-box',
    summary: 'Keyword search for news queries.',
    animationKey: 'filter-table',
    companionTypes: ['visual.news.results-table', 'visual.news.language-select'],
    placementMessage: 'Put search below filters and above the results table.',
  },
  {
    type: 'visual.news.results-table',
    summary: 'Headlines table with source, region, and published time.',
    animationKey: 'filter-table',
    companionTypes: [
      'visual.news.search-box',
      'visual.news.article-detail',
      'visual.news.language-select',
    ],
    placementMessage: 'Place below search; bind selected row to article detail.',
  },
  {
    type: 'visual.news.article-detail',
    summary: 'Full article view for a selected headline row.',
    animationKey: 'filter-table',
    companionTypes: ['visual.news.results-table'],
    placementMessage: 'Place below results; bind results.selectedRow → article.row.',
  },
];

const guideByType = new Map(GROUPING_GUIDES.map((guide) => [guide.type, guide]));

const FILTER_TYPES = new Set(['visual.input.date-range', 'domain.time-preset']);
const DATA_VISUAL_TYPES = new Set([
  'visual.table',
  'visual.detail',
  'visual.chart.line',
  'visual.chart.bar',
  'visual.chart.pie',
  'visual.display.3d-bar-chart',
  'visual.kpi',
]);
const INFRA_DATA_TYPES = new Set([
  'infra.postgresql',
  'infra.mongodb',
  'infra.mysql',
  'infra.supabase',
]);
const SERVER_TYPES = new Set([
  'infra.server.nest',
  'infra.server.express',
  'infra.server.next',
  'infra.server.nuxt',
]);
const ACCESS_TYPES = new Set(['domain.role-gate', 'domain.role-assign', 'domain.person-invite']);
const FORM_INPUT_TYPES = new Set([
  'visual.input.text',
  'visual.input.select',
  'visual.input.number',
  'visual.input.checkbox',
  'visual.input.textarea',
]);

export function getBaseGroupingGuide(type: string): ComponentGroupingGuide | undefined {
  return guideByType.get(type);
}

export function getGroupingGuide(type: string): ComponentGroupingGuide | undefined {
  const guide = guideByType.get(type);
  if (!guide) {
    return undefined;
  }
  return mergeInstructionGuide(guide);
}

export function listInstructionGuides(): ComponentGroupingGuide[] {
  return GROUPING_GUIDES.map((guide) => getGroupingGuide(guide.type)).filter(
    (guide): guide is ComponentGroupingGuide => guide !== undefined,
  );
}

export function getInstructionSteps(type: string): InstructionStep[] {
  const guide = getGroupingGuide(type);
  if (!guide?.steps?.length) {
    return [];
  }
  return [...guide.steps].sort((a, b) => a.order - b.order);
}

export function hasInstructionGuide(type: string): boolean {
  return getInstructionSteps(type).length >= 3;
}

export function resolveGroupingAnimationBlocks(guide: ComponentGroupingGuide): string[] {
  if (guide.animationBlocks?.length) {
    return guide.animationBlocks;
  }

  switch (guide.animationKey) {
    case 'filter-table':
      return ['Date Range', 'Data Table'];
    case 'filter-chart':
      return ['Date Range', 'Chart'];
    case 'data-stack':
      return ['Database', 'Server', 'Table'];
    case 'form-row':
      return ['Text Input', 'Checkbox'];
    case 'access-flow':
      return ['Role Gate', 'Role Assign', 'Invite'];
    case 'server-data':
      return ['NestJS Server', 'PostgreSQL', 'Table'];
    default:
      return ['Component', 'Companion'];
  }
}

export function listGroupingGuides(): ComponentGroupingGuide[] {
  return [...GROUPING_GUIDES];
}

export function listMissingCompanionTypes(
  sourceType: string,
  canvasTypes: Iterable<string>,
): string[] {
  const guide = getGroupingGuide(sourceType);
  if (!guide) {
    return [];
  }

  const present = new Set(canvasTypes);
  return guide.companionTypes.filter((type) => !present.has(type));
}

export function resolveCompanionPlacement(
  sourceType: string,
  companionType: string,
): CompanionPlacement {
  if (FILTER_TYPES.has(companionType) && DATA_VISUAL_TYPES.has(sourceType)) {
    return 'above';
  }
  if (FILTER_TYPES.has(sourceType) && DATA_VISUAL_TYPES.has(companionType)) {
    return 'below';
  }
  if (INFRA_DATA_TYPES.has(companionType) && DATA_VISUAL_TYPES.has(sourceType)) {
    return 'above';
  }
  if (INFRA_DATA_TYPES.has(sourceType) && DATA_VISUAL_TYPES.has(companionType)) {
    return 'below';
  }
  if (SERVER_TYPES.has(companionType) && INFRA_DATA_TYPES.has(sourceType)) {
    return 'below';
  }
  if (SERVER_TYPES.has(sourceType) && INFRA_DATA_TYPES.has(companionType)) {
    return 'above';
  }
  if (ACCESS_TYPES.has(sourceType) && ACCESS_TYPES.has(companionType)) {
    return 'right';
  }
  if (FORM_INPUT_TYPES.has(companionType) && sourceType === 'layout.modal') {
    return 'below';
  }
  if (DATA_VISUAL_TYPES.has(companionType)) {
    if (sourceType === 'visual.table' && companionType === 'visual.detail') {
      return 'right';
    }
    if (sourceType === 'visual.detail' && companionType === 'visual.table') {
      return 'left';
    }
    return 'below';
  }
  return 'right';
}

function snap(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function computeCompanionLayout(
  sourceLayout: NodeLayout,
  sourceType: string,
  companionType: string,
  options: CompanionLayoutOptions = {},
): ResolvedCompanionLayout {
  const gridSize = options.gridSize ?? 16;
  const defaultWidth = options.defaultWidth ?? sourceLayout.width;
  const defaultHeight = options.defaultHeight ?? sourceLayout.height;
  const placement = resolveCompanionPlacement(sourceType, companionType);
  const gap = gridSize;

  switch (placement) {
    case 'above':
      return {
        x: Math.max(0, snap(sourceLayout.x, gridSize)),
        y: Math.max(0, snap(sourceLayout.y - defaultHeight - gap, gridSize)),
        width: defaultWidth,
        height: defaultHeight,
      };
    case 'below':
      return {
        x: Math.max(0, snap(sourceLayout.x, gridSize)),
        y: Math.max(0, snap(sourceLayout.y + sourceLayout.height + gap, gridSize)),
        width: defaultWidth,
        height: defaultHeight,
      };
    case 'left':
      return {
        x: Math.max(0, snap(sourceLayout.x - defaultWidth - gap, gridSize)),
        y: Math.max(0, snap(sourceLayout.y, gridSize)),
        width: defaultWidth,
        height: defaultHeight,
      };
    case 'right':
      return {
        x: Math.max(0, snap(sourceLayout.x + sourceLayout.width + gap, gridSize)),
        y: Math.max(0, snap(sourceLayout.y, gridSize)),
        width: defaultWidth,
        height: defaultHeight,
      };
  }
}

export function groupingAnimationLabel(key: GroupingAnimationKey): string {
  const labels: Record<GroupingAnimationKey, string> = {
    'filter-table': 'Filter → Table',
    'filter-chart': 'Filter → Chart',
    'data-stack': 'Database → Visual',
    'form-row': 'Form fields',
    'access-flow': 'Access workflow',
    'server-data': 'Server → Data → UI',
  };
  return labels[key];
}
