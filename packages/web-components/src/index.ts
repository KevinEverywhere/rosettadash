export * from './media/index';
export * from './wasm/index';
export * from './layout/accordion/index';
export * from './layout/accordion-link-list/index';
export * from './visual/link-list/index';

import { registerLayoutAccordion } from './layout/accordion/index';
import { registerLayoutAccordionLinkList } from './layout/accordion-link-list/index';
import { registerVisualLinkList } from './visual/link-list/index';
import { registerRosettaDashMediaElements } from './media/index';
import { registerRosettaDashWasmElements } from './wasm/index';

/** Register all RosettaDash runtime custom elements (layout + media + wasm). */
export function registerRosettaDashElements(): void {
  registerLayoutAccordion();
  registerLayoutAccordionLinkList();
  registerVisualLinkList();
  registerRosettaDashMediaElements();
  registerRosettaDashWasmElements();
}
