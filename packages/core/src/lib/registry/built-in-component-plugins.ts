import { findPaletteGroupIdForType } from '../palette/palette-groups';
import { P0_COMPONENT_DEFINITIONS } from './p0-components';
import type { ComponentPlugin, ComponentPluginDescriptor } from './component-plugin';
import { toComponentPluginDescriptor } from './component-plugin';
import { EXTENSION_COMPONENT_PLUGINS } from './extension-component-plugins';
import { MEDIA_COMPONENT_PLUGINS } from './media-component-plugins';
import { SVG_COMPONENT_PLUGINS } from './svg-component-plugins';
import { VR_COMPONENT_PLUGINS } from './vr-component-plugins';
import { WASM_COMPONENT_PLUGINS } from './wasm-component-plugins';

function previewKindForCategory(category: ComponentPlugin['definition']['category']): ComponentPlugin['metadata']['previewKind'] {
  if (category === 'infra') {
    return 'infra';
  }
  return 'builtin';
}

export function createBuiltInComponentPlugins(): ComponentPlugin[] {
  return P0_COMPONENT_DEFINITIONS.map((definition) => ({
    id: definition.type,
    definition,
    metadata: {
      paletteGroupId: findPaletteGroupIdForType(definition.type) ?? 'uncategorized',
      previewKind: previewKindForCategory(definition.category),
    },
  }));
}

export const builtInComponentPluginDescriptors: ComponentPluginDescriptor[] = [
  ...createBuiltInComponentPlugins().map(toComponentPluginDescriptor),
  ...EXTENSION_COMPONENT_PLUGINS.map(toComponentPluginDescriptor),
  ...VR_COMPONENT_PLUGINS.map(toComponentPluginDescriptor),
  ...SVG_COMPONENT_PLUGINS.map(toComponentPluginDescriptor),
  ...WASM_COMPONENT_PLUGINS.map(toComponentPluginDescriptor),
  ...MEDIA_COMPONENT_PLUGINS.map(toComponentPluginDescriptor),
];

export function getComponentPluginDescriptor(type: string): ComponentPluginDescriptor | undefined {
  return builtInComponentPluginDescriptors.find((entry) => entry.type === type);
}

export function listComponentPluginsByPaletteGroup(groupId: string): ComponentPluginDescriptor[] {
  return builtInComponentPluginDescriptors.filter((entry) => entry.paletteGroupId === groupId);
}
