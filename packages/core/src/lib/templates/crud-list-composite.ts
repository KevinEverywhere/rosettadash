import type { ComponentRegistry } from '../registry/component-registry';
import { defaultComponentRegistry } from '../registry/component-registry';
import type { Composite } from '../model/types';
import { CRUD_LIST_TEMPLATE_ID } from './template-ids';
import type { BuildCompositeTemplateOptions } from './template-types';

export function buildCrudListComposite(
  registry: ComponentRegistry = defaultComponentRegistry,
  options: BuildCompositeTemplateOptions = {},
): Composite {
  const table = registry.createNode('visual.table', {
    id: 'crud-table',
    label: 'Records',
    layout: { x: 24, y: 24, width: 360, height: 180 },
    properties: { pageSize: 25, sortable: true, filterable: true },
  });

  const modal = registry.createNode('layout.modal', {
    id: 'crud-modal',
    label: 'Edit record',
    layout: { x: 24, y: 224, width: 280, height: 96 },
    properties: { title: 'Edit record' },
  });

  const nameInput = registry.createNode('visual.input.text', {
    id: 'crud-name-input',
    label: 'Name',
    layout: { x: 320, y: 224, width: 220, height: 72 },
    properties: { placeholder: 'Record name', required: true },
  });

  const postgres = registry.createNode('infra.postgresql', {
    id: 'crud-pg',
    properties: { connectionEnvKey: 'DATABASE_URL', table: 'records' },
  });

  const server = registry.createNode('infra.server.nest', {
    id: 'crud-server',
    properties: { globalPrefix: 'api' },
  });

  return {
    id: options.id ?? crypto.randomUUID(),
    name: 'CRUD list',
    description: 'Data table with modal and text input for edit flows.',
    templateId: CRUD_LIST_TEMPLATE_ID,
    version: options.version ?? 1,
    nodes: [table, modal, nameInput, postgres, server],
    bindings: [
      {
        id: 'crud-b1',
        sourceNodeId: 'crud-pg',
        sourcePortId: 'rowset',
        targetNodeId: 'crud-table',
        targetPortId: 'data',
      },
    ],
    exportTargets: {
      ui: 'react',
      server: 'nest',
      database: 'postgresql',
    },
  };
}
