import { defaultComponentRegistry } from './component-registry';
import { WASM_COMPONENT_PLUGINS } from './wasm-component-plugins';

describe('wasm component plugins', () => {
  it('registers wasm compute palette plugins', () => {
    for (const plugin of WASM_COMPONENT_PLUGINS) {
      const registered = defaultComponentRegistry.get(plugin.definition.type);
      expect(registered?.label).toBe(plugin.definition.label);
      expect(plugin.metadata.paletteGroupId).toBe('wasm-compute');
      expect(plugin.metadata.previewKind).toBe('plugin');
    }
  });

  it('models ffmpeg-oriented media outputs', () => {
    const media = defaultComponentRegistry.get('visual.wasm.media');
    expect(media?.outputs.map((port) => port.id)).toEqual([
      'output-blob',
      'progress',
      'metadata',
    ]);
  });
});
