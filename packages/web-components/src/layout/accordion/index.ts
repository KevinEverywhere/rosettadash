export type { AccordionProps } from './accordion.js';
export {
  RD_ACCORDION_TAG,
  RdAccordionElement,
  registerRdAccordion,
} from './accordion.js';

import { registerRdAccordion } from './accordion.js';

/** Convenience: register layout/accordion custom element. */
export function registerLayoutAccordion(): void {
  registerRdAccordion();
}
