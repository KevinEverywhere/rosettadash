export type { LinkListItem, LinkListProps } from './rd-link-list.js';
export {
  RD_LINK_LIST_TAG,
  RdLinkListElement,
  registerRdLinkList,
} from './rd-link-list.js';

import { registerRdLinkList } from './rd-link-list.js';

/** Convenience: register visual/link-list custom element. */
export function registerVisualLinkList(): void {
  registerRdLinkList();
}
