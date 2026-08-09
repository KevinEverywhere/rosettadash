import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import type { Composite } from '../model/types';
import { DEFAULT_ROLE_PRESETS } from '../domain/role-visibility';
import { SETTINGS_ADMIN_TEMPLATE_ID } from './template-ids';
import type { BuildCompositeTemplateOptions } from './template-types';

export function buildSettingsAdminComposite(
  registry: ComponentRegistry = defaultComponentRegistry,
  options: BuildCompositeTemplateOptions = {},
): Composite {
  const roleGate = registry.createNode('domain.role-gate', {
    id: 'settings-role-gate',
    label: 'Admin only',
    layout: { x: 24, y: 24, width: 360, height: 72 },
    properties: { roles: ['admin', 'owner'] },
  });

  const table = registry.createNode('visual.table', {
    id: 'settings-table',
    label: 'Settings',
    layout: { x: 24, y: 112, width: 360, height: 160 },
    properties: { pageSize: 25 },
  });

  const apiKeyInput = registry.createNode('visual.input.text', {
    id: 'settings-api-key',
    label: 'API key label',
    layout: { x: 24, y: 288, width: 280, height: 72 },
    properties: { placeholder: 'Display name for setting', required: false },
  });

  const postgres = registry.createNode('infra.postgresql', {
    id: 'settings-pg',
    properties: { connectionEnvKey: 'DATABASE_URL', table: 'settings' },
  });

  const server = registry.createNode('infra.server.nest', {
    id: 'settings-server',
    properties: { globalPrefix: 'api' },
  });

  return {
    id: options.id ?? crypto.randomUUID(),
    name: 'Admin settings',
    description: 'Role-gated settings table with admin-only fields.',
    templateId: SETTINGS_ADMIN_TEMPLATE_ID,
    version: options.version ?? 1,
    nodes: [roleGate, table, apiKeyInput, postgres, server],
    bindings: [
      {
        id: 'settings-b1',
        sourceNodeId: 'settings-pg',
        sourcePortId: 'rowset',
        targetNodeId: 'settings-table',
        targetPortId: 'data',
      },
    ],
    exportTargets: {
      ui: 'react',
      server: 'nest',
      database: 'postgresql',
    },
    domainContext: {
      roles: DEFAULT_ROLE_PRESETS,
    },
  };
}
