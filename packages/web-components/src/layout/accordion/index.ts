export type { AccordionProps } from './rd-accordion.js';
export {
  RD_ACCORDION_TAG,
  RdAccordionElement,
  registerRdAccordion,
} from './rd-accordion.js';

import { registerRdAccordion } from './rd-accordion.js';

/** Convenience: register layout/accordion custom element. */
export function registerLayoutAccordion(): void {
  registerRdAccordion();
}
