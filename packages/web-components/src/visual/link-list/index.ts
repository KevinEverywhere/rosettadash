export type { LinkListItem, LinkListProps } from './link-list.js';
export {
  RD_LINK_LIST_TAG,
  RdLinkListElement,
  registerRdLinkList,
} from './link-list.js';

import { registerRdLinkList } from './link-list.js';

/** Convenience: register visual/link-list custom element. */
export function registerVisualLinkList(): void {
  registerRdLinkList();
}
