import { defaultComponentRegistry } from '../registry/component-registry';
import { VR_COMPONENT_PLUGINS } from './vr-component-plugins';

describe('VR component plugins', () => {
  it('registers three VR visuals on the default registry', () => {
    for (const plugin of VR_COMPONENT_PLUGINS) {
      expect(defaultComponentRegistry.get(plugin.definition.type)?.label).toBe(
        plugin.definition.label,
      );
      expect(defaultComponentRegistry.getPlugin(plugin.definition.type)?.metadata.paletteGroupId).toBe(
        'vr-visuals',
      );
    }
  });

  it('keeps VR palette group at four items', () => {
    expect(VR_COMPONENT_PLUGINS).toHaveLength(4);
  });
});
