export * from './media/index';
export * from './wasm/index';

import { registerRosettaDashMediaElements } from './media/index';
import { registerRosettaDashWasmElements } from './wasm/index';

/** Register all RosettaDash runtime custom elements (media + wasm). */
export function registerRosettaDashElements(): void {
  registerRosettaDashMediaElements();
  registerRosettaDashWasmElements();
}
