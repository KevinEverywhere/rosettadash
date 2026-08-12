import { Accordion, type AccordionProps } from '../accordion/Accordion';
import { LinkList, type LinkListProps } from '../../visual/link-list/LinkList';

/** Public props for the accordion + link-list recipe. */
export interface AccordionLinkListProps
  extends Omit<AccordionProps, 'children'>,
    Pick<LinkListProps, 'items' | 'dense'> {}

/**
 * Recipe: collapsible nav / TOC composed from Accordion + LinkList.
 */
export function AccordionLinkList({
  title,
  open,
  defaultOpen = false,
  className,
  style,
  onOpenChange,
  onToggle,
  items = [],
  dense = false,
}: AccordionLinkListProps) {
  const recipeClass = ['rd-accordion-link-list', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Accordion
      title={title}
      open={open}
      defaultOpen={defaultOpen}
      className={recipeClass}
      style={style}
      onOpenChange={onOpenChange}
      onToggle={onToggle}
    >
      <LinkList items={items} dense={dense} />
    </Accordion>
  );
}
