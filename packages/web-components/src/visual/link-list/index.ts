export type { LinkListItem, LinkListProps } from './link-list';
export {
  RD_LINK_LIST_TAG,
  RdLinkListElement,
  registerRdLinkList,
} from './link-list';

import { registerRdLinkList } from './link-list';

/** Convenience: register visual/link-list custom element. */
export function registerVisualLinkList(): void {
  registerRdLinkList();
}
