import type { WasmMediaProps } from './wasm-media';

describe('@rosettadash/angular/visual/wasm/media', () => {
  it('exposes typed props contract', () => {
    const props: WasmMediaProps = { label: 'Transcode', operation: 'equirect-extract' };
    expect(props.label).toBe('Transcode');
  });
});
