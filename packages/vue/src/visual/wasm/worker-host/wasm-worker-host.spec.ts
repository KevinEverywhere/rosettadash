import type { WasmWorkerHostProps } from './wasm-worker-host';

describe('@rosettadash/vue/visual/wasm/worker-host', () => {
  it('exposes typed props contract', () => {
    const props: WasmWorkerHostProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-wasm-worker-host', () => {
    expect('rd-wasm-worker-host').toMatch(/^rd-/);
  });
});
