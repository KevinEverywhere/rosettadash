export type { AccordionLinkListProps } from './rd-accordion-link-list.js';
export {
  AccordionLinkList,
  RD_ACCORDION_LINK_LIST_TAG,
  RdAccordionLinkListElement,
  registerRdAccordionLinkList,
} from './rd-accordion-link-list.js';

import { registerRdAccordionLinkList } from './rd-accordion-link-list.js';

/** Convenience: register layout/accordion-link-list recipe element. */
export function registerLayoutAccordionLinkList(): void {
  registerRdAccordionLinkList();
}
