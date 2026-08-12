import { ComponentRegistry } from './component-registry';
import { EXTENSION_COMPONENT_PLUGINS } from './extension-component-plugins';
import {
  builtInComponentPluginDescriptors,
  createBuiltInComponentPlugins,
  getComponentPluginDescriptor,
} from './built-in-component-plugins';

describe('component plugins', () => {
  it('describes every built-in P0 type with palette metadata', () => {
    const plugins = createBuiltInComponentPlugins();
    expect(plugins.length).toBeGreaterThan(20);
    expect(plugins.every((plugin) => plugin.metadata.paletteGroupId.length > 0)).toBe(true);
  });

  it('registers extension plugins on a registry instance', () => {
    const registry = new ComponentRegistry([]);
    for (const plugin of EXTENSION_COMPONENT_PLUGINS) {
      registry.registerPlugin(plugin);
    }

    expect(registry.get('visual.plugin.status-badge')?.label).toBe('Status Badge');
    expect(registry.getPlugin('visual.plugin.metric-chip')?.metadata.previewKind).toBe('plugin');
    expect(registry.listPlugins()).toHaveLength(2);
  });

  it('includes extension plugins in the built-in descriptor manifest', () => {
    expect(getComponentPluginDescriptor('visual.plugin.status-badge')).toMatchObject({
      paletteGroupId: 'plugin-extensions',
      previewKind: 'plugin',
    });
    expect(builtInComponentPluginDescriptors.some((entry) => entry.type.startsWith('visual.plugin.'))).toBe(
      true,
    );
  });

  it('rejects duplicate plugin registration', () => {
    const registry = new ComponentRegistry([]);
    registry.registerPlugin(EXTENSION_COMPONENT_PLUGINS[0]);
    expect(() => registry.registerPlugin(EXTENSION_COMPONENT_PLUGINS[0])).toThrow(/already registered/i);
  });
});
