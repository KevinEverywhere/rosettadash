export * from './media/index';
export * from './wasm/index';
export * from './layout/accordion/index';

import { registerLayoutAccordion } from './layout/accordion/index';
import { registerRosettaDashMediaElements } from './media/index';
import { registerRosettaDashWasmElements } from './wasm/index';

/** Register all RosettaDash runtime custom elements (layout + media + wasm). */
export function registerRosettaDashElements(): void {
  registerLayoutAccordion();
  registerRosettaDashMediaElements();
  registerRosettaDashWasmElements();
}
