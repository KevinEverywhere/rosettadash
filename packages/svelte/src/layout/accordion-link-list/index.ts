import type { AccordionProps } from '../accordion/index';
import type { LinkListItem, LinkListProps } from '../../visual/link-list/index';

export interface AccordionLinkListProps
  extends AccordionProps, Pick<LinkListProps, 'items' | 'dense'> {}

export interface AccordionLinkListRenderModel {
  runtime: 'svelte';
  tag: 'rd-accordion-link-list';
  props: {
    title: string;
    defaultOpen: boolean;
    className?: string;
    items: LinkListItem[];
    dense: boolean;
    children?: unknown;
  };
}

/** Recipe helper stub — collapsible nav / TOC. */
export function AccordionLinkList(
  props: AccordionLinkListProps,
): AccordionLinkListRenderModel {
  return {
    runtime: 'svelte',
    tag: 'rd-accordion-link-list',
    props: {
      title: props.title,
      defaultOpen: props.defaultOpen ?? false,
      className: props.className,
      items: props.items ?? [],
      dense: props.dense ?? false,
      children: props.children,
    },
  };
}
