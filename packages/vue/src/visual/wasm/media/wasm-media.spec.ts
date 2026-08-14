import type { WasmMediaProps } from './wasm-media';

describe('@rosettadash/vue/visual/wasm/media', () => {
  it('exposes typed props contract', () => {
    const props: WasmMediaProps = { operation: 'equirect-extract' };
    expect(props.operation).toBe('equirect-extract');
  });
});
