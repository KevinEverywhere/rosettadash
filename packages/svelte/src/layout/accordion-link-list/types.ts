import type { LinkListItem } from '../../visual/link-list/types';

export interface AccordionLinkListProps {
  title: string;
  open?: boolean;
  defaultOpen?: boolean;
  className?: string;
  items?: LinkListItem[];
  dense?: boolean;
}
