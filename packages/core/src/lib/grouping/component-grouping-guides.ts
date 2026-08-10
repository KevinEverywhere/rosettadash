import type {
  CompanionLayoutOptions,
  CompanionPlacement,
  ComponentGroupingGuide,
  GroupingAnimationKey,
  ResolvedCompanionLayout,
} from './types';
import type { NodeLayout } from '../model/types';
import {
  INSTRUCTION_GUIDE_TYPES,
  getInstructionSteps,
  hasInstructionGuide,
  mergeInstructionGuide,
} from './component-instruction-guides';

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

export function getGroupingGuide(type: string): ComponentGroupingGuide | undefined {
  const guide = guideByType.get(type);
  if (!guide) {
    return undefined;
  }
  return mergeInstructionGuide(guide);
}

export function listInstructionGuides(): ComponentGroupingGuide[] {
  return INSTRUCTION_GUIDE_TYPES.map((type) => getGroupingGuide(type)).filter(
    (guide): guide is ComponentGroupingGuide => guide !== undefined,
  );
}

export { getInstructionSteps, hasInstructionGuide };

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
