import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import type { Composite } from '../model/types';
import { EMPTY_STARTER_TEMPLATE_ID } from './template-ids';
import type { BuildCompositeTemplateOptions } from './template-types';

export function buildEmptyStarterComposite(
  registry: ComponentRegistry = defaultComponentRegistry,
  options: BuildCompositeTemplateOptions = {},
): Composite {
  const grid = registry.createNode('layout.grid', {
    id: 'starter-grid',
    label: 'Page layout',
    layout: { x: 24, y: 24, width: 360, height: 160 },
    properties: { columns: 12, gap: 16 },
  });

  const env = registry.createNode('infra.env', {
    id: 'starter-env',
    properties: {
      variables: [{ key: 'DATABASE_URL', description: 'PostgreSQL connection string' }],
    },
  });

  const postgres = registry.createNode('infra.postgresql', {
    id: 'starter-pg',
    properties: { connectionEnvKey: 'DATABASE_URL', table: '' },
  });

  const server = registry.createNode('infra.server.nest', {
    id: 'starter-server',
    properties: { globalPrefix: 'api' },
  });

  return {
    id: options.id ?? crypto.randomUUID(),
    name: 'Empty starter',
    description: 'Grid layout with env, PostgreSQL, and NestJS infra nodes.',
    templateId: EMPTY_STARTER_TEMPLATE_ID,
    version: options.version ?? 1,
    nodes: [grid, env, postgres, server],
    bindings: [],
    exportTargets: {
      ui: 'react',
      server: 'nest',
      database: 'postgresql',
    },
  };
}
