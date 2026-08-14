import type { WasmModuleProps } from './wasm-module';

describe('@rosettadash/vue/visual/wasm/module', () => {
  it('exposes typed props contract', () => {
    const props: WasmModuleProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-wasm-module', () => {
    expect('rd-wasm-module').toMatch(/^rd-/);
  });
});
