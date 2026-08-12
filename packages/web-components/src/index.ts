export * from './visual/media/index.js';
export * from './wasm/index.js';
export * from './layout/accordion/index.js';
export * from './layout/accordion-link-list/index.js';
export * from './visual/link-list/index.js';
export * from './catalog/index.js';

import { registerLayoutAccordion } from './layout/accordion/index.js';
import { registerLayoutAccordionLinkList } from './layout/accordion-link-list/index.js';
import { registerVisualLinkList } from './visual/link-list/index.js';
import { registerRosettaDashMediaElements } from './visual/media/index.js';
import { registerRosettaDashWasmElements } from './wasm/index.js';

import { registerRosettaDashCatalogElements } from './catalog/index.js';

import './register-shadow-bases.browser.js';

/** Register all RosettaDash runtime custom elements (layout + media + wasm + catalog). */
export function registerRosettaDashElements(): void {
  registerLayoutAccordion();
  registerLayoutAccordionLinkList();
  registerVisualLinkList();
  registerRosettaDashMediaElements();
  registerRosettaDashWasmElements();
  registerRosettaDashCatalogElements();
}
