import { validateComposite } from '../validation/validate-composite';
import { defaultComponentRegistry } from '../registry/component-registry';
import { buildCompositeTemplate, listCompositeTemplates } from './composite-template-registry';
import { DASHBOARD_STARTER_TEMPLATE_IDS } from './dashboard-starter-template-ids';
import { NEWS_FINDER_TEMPLATE_ID } from './news-finder-template-id';
import {
  ANALYTICS_OVERVIEW_TEMPLATE_ID,
  CRUD_LIST_TEMPLATE_ID,
  EMPTY_STARTER_TEMPLATE_ID,
  ONBOARDING_TEMPLATE_ID,
  SETTINGS_ADMIN_TEMPLATE_ID,
} from './template-ids';

describe('composite templates', () => {
  const registry = defaultComponentRegistry;
  const templateIds = [
    ONBOARDING_TEMPLATE_ID,
    ANALYTICS_OVERVIEW_TEMPLATE_ID,
    CRUD_LIST_TEMPLATE_ID,
    SETTINGS_ADMIN_TEMPLATE_ID,
    EMPTY_STARTER_TEMPLATE_ID,
    NEWS_FINDER_TEMPLATE_ID,
    ...DASHBOARD_STARTER_TEMPLATE_IDS,
  ];

  it.each(templateIds)('builds strict-valid composite for %s', (templateId) => {
    const composite = buildCompositeTemplate(templateId, registry, {
      id: 'template-test',
      version: 1,
    });

    expect(composite.templateId).toBe(templateId);
    expect(composite.nodes.length).toBeGreaterThan(0);

    const result = validateComposite(composite, registry, { mode: 'strict' });
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('lists all dashboard starter templates', () => {
    const templates = listCompositeTemplates();
    for (const id of DASHBOARD_STARTER_TEMPLATE_IDS) {
      expect(templates.some((template) => template.id === id)).toBe(true);
    }
  });

  it('throws for unknown template id', () => {
    expect(() => buildCompositeTemplate('unknown', registry)).toThrow(/Unknown composite template/);
  });
});
