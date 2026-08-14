import type { WasmMediaProps } from './types';

describe('@rosettadash/svelte/visual/wasm/media', () => {
  it('exposes typed props contract', () => {
    const props: WasmMediaProps = { operation: 'equirect-extract' };
    expect(props.operation).toBe('equirect-extract');
  });
});
