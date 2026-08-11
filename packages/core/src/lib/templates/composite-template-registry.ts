import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import type { Composite } from '../model/types';
import { buildAnalyticsOverviewComposite } from './analytics-overview-composite';
import { buildCrudListComposite } from './crud-list-composite';
import { buildEmptyStarterComposite } from './empty-starter-composite';
import { buildNewsFinderComposite } from './news-finder-composite';
import { buildOnboardingComposite } from './onboarding-composite';
import { buildSettingsAdminComposite } from './settings-admin-composite';
import {
  ANALYTICS_OVERVIEW_TEMPLATE_ID,
  CRUD_LIST_TEMPLATE_ID,
  EMPTY_STARTER_TEMPLATE_ID,
  ONBOARDING_TEMPLATE_ID,
  SETTINGS_ADMIN_TEMPLATE_ID,
} from './template-ids';
import { NEWS_FINDER_TEMPLATE_ID } from './news-finder-template-id';
import type {
  BuildCompositeTemplateOptions,
  CompositeTemplateDefinition,
} from './template-types';

export const COMPOSITE_TEMPLATE_DEFINITIONS: CompositeTemplateDefinition[] = [
  {
    id: ONBOARDING_TEMPLATE_ID,
    name: 'Team onboarding',
    description: 'Invite a person, assign a role, and confirm access.',
    build: buildOnboardingComposite,
  },
  {
    id: ANALYTICS_OVERVIEW_TEMPLATE_ID,
    name: 'Analytics overview',
    description: 'Date-filtered KPIs, table, and line chart.',
    build: buildAnalyticsOverviewComposite,
  },
  {
    id: CRUD_LIST_TEMPLATE_ID,
    name: 'CRUD list',
    description: 'Table with modal and text input for edit flows.',
    build: buildCrudListComposite,
  },
  {
    id: SETTINGS_ADMIN_TEMPLATE_ID,
    name: 'Admin settings',
    description: 'Role-gated settings table and fields.',
    build: buildSettingsAdminComposite,
  },
  {
    id: EMPTY_STARTER_TEMPLATE_ID,
    name: 'Empty starter',
    description: 'Grid layout with env and infra nodes only.',
    build: buildEmptyStarterComposite,
  },
  {
    id: NEWS_FINDER_TEMPLATE_ID,
    name: 'News finder',
    description: 'Language, region, type filters, search, results table, and article detail.',
    build: buildNewsFinderComposite,
  },
];

const templateById = new Map(
  COMPOSITE_TEMPLATE_DEFINITIONS.map((definition) => [definition.id, definition]),
);

export function listCompositeTemplates(): Pick<
  CompositeTemplateDefinition,
  'id' | 'name' | 'description'
>[] {
  return COMPOSITE_TEMPLATE_DEFINITIONS.map(({ id, name, description }) => ({
    id,
    name,
    description,
  }));
}

export function buildCompositeTemplate(
  templateId: string,
  registry: ComponentRegistry = defaultComponentRegistry,
  options: BuildCompositeTemplateOptions = {},
): Composite {
  const definition = templateById.get(templateId);
  if (!definition) {
    throw new Error(`Unknown composite template: ${templateId}`);
  }
  return definition.build(registry, options);
}
