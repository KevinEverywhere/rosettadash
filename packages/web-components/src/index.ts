export * from './media/index.js';
export * from './wasm/index.js';
export * from './layout/accordion/index.js';
export * from './layout/accordion-link-list/index.js';
export * from './visual/link-list/index.js';

import { registerLayoutAccordion } from './layout/accordion/index.js';
import { registerLayoutAccordionLinkList } from './layout/accordion-link-list/index.js';
import { registerVisualLinkList } from './visual/link-list/index.js';
import { registerRosettaDashMediaElements } from './media/index.js';
import { registerRosettaDashWasmElements } from './wasm/index.js';

/** Register all RosettaDash runtime custom elements (layout + media + wasm). */
export function registerRosettaDashElements(): void {
  registerLayoutAccordion();
  registerLayoutAccordionLinkList();
  registerVisualLinkList();
  registerRosettaDashMediaElements();
  registerRosettaDashWasmElements();
}
