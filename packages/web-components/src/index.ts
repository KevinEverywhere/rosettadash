export * from './media/index';
export * from './wasm/index';

import { registerDashBuilderMediaElements } from './media/index';
import { registerDashBuilderWasmElements } from './wasm/index';

/** Register all DashBuilder runtime custom elements (media + wasm). */
export function registerDashBuilderElements(): void {
  registerDashBuilderMediaElements();
  registerDashBuilderWasmElements();
}
