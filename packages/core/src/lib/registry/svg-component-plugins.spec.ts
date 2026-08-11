import { defaultComponentRegistry } from './component-registry';
import { SVG_COMPONENT_PLUGINS } from './svg-component-plugins';

describe('svg component plugins', () => {
  it('registers inline and icon SVG plugins', () => {
    for (const plugin of SVG_COMPONENT_PLUGINS) {
      const registered = defaultComponentRegistry.get(plugin.definition.type);
      expect(registered?.label).toBe(plugin.definition.label);
      expect(plugin.metadata.paletteGroupId).toBe('svg-visuals');
      expect(plugin.metadata.previewKind).toBe('plugin');
    }
  });

  it('exposes row inputs for data-bound styling', () => {
    const inline = defaultComponentRegistry.get('visual.svg.inline');
    expect(inline?.inputs.some((port) => port.dataType === 'row')).toBe(true);

    const icon = defaultComponentRegistry.get('visual.svg.icon');
    expect(icon?.properties.some((property) => property.key === 'colorField')).toBe(true);
  });
});
