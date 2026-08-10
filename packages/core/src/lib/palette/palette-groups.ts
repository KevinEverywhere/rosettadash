import type { ComponentDefinition } from '../model/types';
import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import { P0_COMPONENT_DEFINITIONS } from '../registry/p0-components';
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
    id: 'layout',
    label: 'Layout & Navigation',
    types: ['layout.grid', 'layout.flex', 'layout.tabs', 'layout.modal'],
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
  catalogTypes: string[] = P0_COMPONENT_DEFINITIONS.map((def) => def.type),
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
