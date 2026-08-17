import type { ComponentDefinition } from '../model/types';
import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import type { PaletteGroupDefinition, ResolvedPaletteGroup } from './types';

/** Functional palette groups (2–7 items each), aligned with component taxonomy. */
export const PALETTE_GROUP_DEFINITIONS: PaletteGroupDefinition[] = [
  {
    id: 'form-inputs',
    label: 'Form Inputs',
    types: [
      'visual.input.text',
      'visual.input.select',
      'visual.input.number',
      'visual.input.checkbox',
      'visual.input.textarea',
      'visual.input.date-range',
      'domain.time-preset',
    ],
  },
  {
    id: 'data-display',
    label: 'Data Display',
    types: ['visual.table', 'visual.detail', 'visual.kpi'],
  },
  {
    id: 'logic-motion',
    label: 'Logic & Motion',
    types: ['visual.skeleton', 'logic.timer'],
  },
  {
    id: 'charts',
    label: 'Charts',
    types: ['visual.chart.line', 'visual.chart.bar', 'visual.chart.pie'],
  },
  {
    id: 'views',
    label: 'Views',
    types: ['visual.chart.sankey', 'visual.chart.venn', 'visual.media.carousel'],
  },
  {
    id: 'layout',
    label: 'Layout & Navigation',
    types: [
      'layout.grid',
      'layout.flex',
      'layout.tabs',
      'layout.modal',
      'layout.collapsible',
      'layout.scroll-region',
    ],
  },
  {
    id: 'access-onboarding',
    label: 'Access & Onboarding',
    types: ['domain.role-gate', 'domain.person-invite', 'domain.role-assign'],
  },
  {
    id: 'data-sources',
    label: 'Data Sources',
    types: [
      'infra.env',
      'infra.postgresql',
      'infra.mongodb',
      'infra.supabase',
      'infra.mysql',
    ],
  },
  {
    id: 'api-servers',
    label: 'API Servers',
    types: [
      'infra.server.nest',
      'infra.server.express',
      'infra.server.next',
      'infra.server.nuxt',
    ],
  },
  {
    id: 'news-discovery',
    label: 'News Discovery',
    types: [
      'visual.news.language-select',
      'visual.news.region-select',
      'visual.news.type-select',
      'visual.news.search-box',
      'visual.news.results-table',
      'visual.news.article-detail',
    ],
  },
  {
    id: 'plugin-extensions',
    label: 'Plugin Extensions',
    types: ['visual.plugin.status-badge', 'visual.plugin.metric-chip'],
  },
  {
    id: 'vr-visuals',
    label: 'VR & 3D',
    types: [
      'visual.display.3d-bar-chart',
      'visual.display.3d-scatter',
      'visual.display.3d-scene',
      'visual.display.3d-gltf-model',
      'visual.display.3d-geo-globe',
    ],
  },
  {
    id: 'svg-visuals',
    label: 'SVG',
    types: ['visual.svg.inline', 'visual.svg.icon'],
  },
  {
    id: 'media-authoring',
    label: 'Media Authoring',
    types: [
      'visual.media.video-source',
      'visual.media.equirect-viewport',
      'visual.media.equirect-sphere-viewport',
      'visual.media.flat-video-viewport',
      'visual.media.live-capture',
    ],
  },
  {
    id: 'wasm-compute',
    label: 'WASM Compute',
    types: [
      'infra.wasm.asset',
      'visual.wasm.worker-host',
      'visual.wasm.module',
      'visual.wasm.media',
    ],
  },
];

const MIN_ITEMS_PER_GROUP = 2;
const MAX_ITEMS_PER_GROUP = 7;

export function findPaletteGroupIdForType(type: string): string | undefined {
  return PALETTE_GROUP_DEFINITIONS.find((group) => group.types.includes(type))?.id;
}

export function resolvePaletteGroups(
  registry: ComponentRegistry = defaultComponentRegistry,
): ResolvedPaletteGroup[] {
  return PALETTE_GROUP_DEFINITIONS.map((group) => ({
    id: group.id,
    label: group.label,
    items: group.types
      .map((type) => registry.get(type))
      .filter(Boolean) as ComponentDefinition[],
  })).filter((group) => group.items.length > 0);
}

/** Validates taxonomy invariants against the P0 catalog. */
export function validatePaletteGroupDefinitions(
  definitions: PaletteGroupDefinition[] = PALETTE_GROUP_DEFINITIONS,
  catalogTypes: string[] = defaultComponentRegistry.list().map((definition) => definition.type),
): void {
  const seen = new Set<string>();

  for (const group of definitions) {
    if (group.types.length < MIN_ITEMS_PER_GROUP || group.types.length > MAX_ITEMS_PER_GROUP) {
      throw new Error(
        `Palette group "${group.id}" has ${group.types.length} items; expected ${MIN_ITEMS_PER_GROUP}–${MAX_ITEMS_PER_GROUP}`,
      );
    }

    for (const type of group.types) {
      if (seen.has(type)) {
        throw new Error(`Component type "${type}" appears in multiple palette groups`);
      }
      seen.add(type);
    }
  }

  const missing = catalogTypes.filter((type) => !seen.has(type));
  if (missing.length > 0) {
    throw new Error(`Palette groups missing P0 types: ${missing.join(', ')}`);
  }

  const extra = [...seen].filter((type) => !catalogTypes.includes(type));
  if (extra.length > 0) {
    throw new Error(`Palette groups reference unknown types: ${extra.join(', ')}`);
  }
}
