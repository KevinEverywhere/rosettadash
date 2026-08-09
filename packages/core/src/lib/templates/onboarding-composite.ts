import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import type { Composite } from '../model/types';
import { DEFAULT_ROLE_PRESETS } from '../domain/role-visibility';
import { ONBOARDING_TEMPLATE_ID } from '../domain/onboarding';

export interface BuildOnboardingCompositeOptions {
  id?: string;
  version?: number;
}

export function buildOnboardingComposite(
  registry: ComponentRegistry = defaultComponentRegistry,
  options: BuildOnboardingCompositeOptions = {},
): Composite {
  const invite = registry.createNode('domain.person-invite', {
    id: 'onboarding-invite',
    label: 'Invite person',
    layout: { x: 24, y: 24, width: 280, height: 104 },
    properties: {
      title: 'Invite team member',
      emailPlaceholder: 'name@company.com',
      submitLabel: 'Send invite',
    },
  });

  const roleAssign = registry.createNode('domain.role-assign', {
    id: 'onboarding-role-assign',
    label: 'Assign role',
    layout: { x: 24, y: 144, width: 280, height: 120 },
    properties: {
      title: 'Assign role',
      confirmLabel: 'Confirm access',
      summaryLabel: 'Review access before confirming',
    },
  });

  const summary = registry.createNode('visual.kpi', {
    id: 'onboarding-summary',
    label: 'Access summary',
    layout: { x: 24, y: 280, width: 220, height: 96 },
    properties: {
      format: 'number',
      showDelta: false,
    },
  });

  const postgres = registry.createNode('infra.postgresql', {
    id: 'onboarding-pg',
    properties: {
      connectionEnvKey: 'DATABASE_URL',
      table: 'team_members',
    },
  });

  const server = registry.createNode('infra.server.nest', {
    id: 'onboarding-server',
    properties: {
      globalPrefix: 'api',
    },
  });

  return {
    id: options.id ?? crypto.randomUUID(),
    name: 'Onboarding',
    description: 'Invite a person, assign a role, and confirm access.',
    templateId: ONBOARDING_TEMPLATE_ID,
    version: options.version ?? 1,
    nodes: [invite, roleAssign, summary, postgres, server],
    bindings: [],
    exportTargets: {
      ui: 'react',
      server: 'nest',
      database: 'postgresql',
    },
    domainContext: {
      roles: DEFAULT_ROLE_PRESETS.slice(0, 3),
    },
  };
}
