import type { ComponentDefinition } from '../model/types';

export type ComponentPreviewKind = 'builtin' | 'plugin' | 'infra';

export interface ComponentPluginMetadata {
  paletteGroupId: string;
  previewKind: ComponentPreviewKind;
}

export interface ComponentPlugin {
  id: string;
  definition: ComponentDefinition;
  metadata: ComponentPluginMetadata;
}

export interface ComponentPluginDescriptor {
  id: string;
  type: string;
  label: string;
  paletteGroupId: string;
  previewKind: ComponentPreviewKind;
  packageName?: string;
}

export function toComponentPluginDescriptor(plugin: ComponentPlugin): ComponentPluginDescriptor {
  return {
    id: plugin.id,
    type: plugin.definition.type,
    label: plugin.definition.label,
    paletteGroupId: plugin.metadata.paletteGroupId,
    previewKind: plugin.metadata.previewKind,
  };
}
