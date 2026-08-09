import { buildExportIR } from '../ir/build-export-ir';
import { buildOnboardingComposite } from '../templates/onboarding-composite';
import { defaultComponentRegistry } from '../registry/component-registry';
import {
  ONBOARDING_TEMPLATE_ID,
  compositeHasOnboardingFlow,
  irHasOnboardingFlow,
  onboardingRoutePaths,
} from './onboarding';

describe('onboarding helpers', () => {
  const registry = defaultComponentRegistry;

  it('detects onboarding flow from template id and domain nodes', () => {
    const composite = buildOnboardingComposite(registry, { id: 'c1', version: 1 });

    expect(composite.templateId).toBe(ONBOARDING_TEMPLATE_ID);
    expect(compositeHasOnboardingFlow(composite)).toBe(true);

    const ir = buildExportIR(composite, registry, { generatedAt: '2026-08-08T00:00:00.000Z' });
    expect(irHasOnboardingFlow(ir)).toBe(true);
    expect(ir.meta.templateId).toBe(ONBOARDING_TEMPLATE_ID);
  });

  it('adds onboarding routes to ExportIR', () => {
    const composite = buildOnboardingComposite(registry, { id: 'c1', version: 1 });
    const ir = buildExportIR(composite, registry, { generatedAt: '2026-08-08T00:00:00.000Z' });

    expect(ir.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          method: 'POST',
          path: '/api/onboarding/invite',
          handlerNodeId: 'onboarding-server',
        }),
        expect.objectContaining({
          method: 'PATCH',
          path: '/api/onboarding/role',
          handlerNodeId: 'onboarding-server',
        }),
        expect.objectContaining({
          method: 'GET',
          path: '/api/team_members',
        }),
      ]),
    );
  });

  it('builds stable onboarding route paths', () => {
    expect(onboardingRoutePaths('api')).toEqual({
      invitePath: '/api/onboarding/invite',
      assignRolePath: '/api/onboarding/role',
    });
  });
});
