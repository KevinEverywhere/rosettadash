export type { AccordionProps } from './accordion';
export {
  RD_ACCORDION_TAG,
  RdAccordionElement,
  registerRdAccordion,
} from './accordion';

import { registerRdAccordion } from './accordion';

/** Convenience: register layout/accordion custom element. */
export function registerLayoutAccordion(): void {
  registerRdAccordion();
}
