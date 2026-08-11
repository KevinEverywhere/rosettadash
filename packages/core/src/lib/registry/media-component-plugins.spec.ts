import { defaultComponentRegistry } from './component-registry';
import { MEDIA_COMPONENT_PLUGINS } from './media-component-plugins';

describe('media component plugins', () => {
  it('registers media authoring palette plugins', () => {
    for (const plugin of MEDIA_COMPONENT_PLUGINS) {
      const registered = defaultComponentRegistry.get(plugin.definition.type);
      expect(registered?.label).toBe(plugin.definition.label);
      expect(plugin.metadata.paletteGroupId).toBe('media-authoring');
    }
  });

  it('defaults equirect viewport to 4096×2048 → 1080×720 → 720×480', () => {
    const viewport = defaultComponentRegistry.get('visual.media.equirect-viewport');
    expect(viewport?.properties.find((p) => p.key === 'cropWidth')?.default).toBe(1080);
    expect(viewport?.properties.find((p) => p.key === 'outputWidth')?.default).toBe(720);
  });
});
