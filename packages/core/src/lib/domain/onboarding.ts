import type { Composite } from '../model/types';
import type { ExportIR } from '../ir/types';
import { ONBOARDING_TEMPLATE_ID } from '../templates/template-ids';

export { ONBOARDING_TEMPLATE_ID };

export function compositeHasOnboardingFlow(composite: Composite): boolean {
  if (composite.templateId === ONBOARDING_TEMPLATE_ID) {
    return true;
  }

  return composite.nodes.some(
    (node) => node.type === 'domain.person-invite' || node.type === 'domain.role-assign',
  );
}

export function irHasOnboardingFlow(ir: ExportIR): boolean {
  if (ir.meta.templateId === ONBOARDING_TEMPLATE_ID) {
    return true;
  }

  return ir.components.some(
    (component) =>
      component.type === 'domain.person-invite' || component.type === 'domain.role-assign',
  );
}

export function onboardingRoutePaths(globalPrefix: string): {
  invitePath: string;
  assignRolePath: string;
} {
  const prefix = globalPrefix.replace(/^\/+|\/+$/g, '');
  return {
    invitePath: `/${prefix}/onboarding/invite`,
    assignRolePath: `/${prefix}/onboarding/role`,
  };
}
