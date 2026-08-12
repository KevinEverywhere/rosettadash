export type { AccordionLinkListProps } from './accordion-link-list';
export {
  AccordionLinkList,
  RD_ACCORDION_LINK_LIST_TAG,
  RdAccordionLinkListElement,
  registerRdAccordionLinkList,
} from './accordion-link-list';

import { registerRdAccordionLinkList } from './accordion-link-list';

/** Convenience: register layout/accordion-link-list recipe element. */
export function registerLayoutAccordionLinkList(): void {
  registerRdAccordionLinkList();
}
