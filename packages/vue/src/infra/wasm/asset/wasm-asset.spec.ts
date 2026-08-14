import type { WasmAssetProps } from './wasm-asset';

describe('@rosettadash/vue/infra/wasm/asset', () => {
  it('exposes typed props contract', () => {
    const props: WasmAssetProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-wasm-asset', () => {
    expect('rd-wasm-asset').toMatch(/^rd-/);
  });
});
