/** Shared public props for visual/link-list (parity with web-components). */
export interface LinkListItem {
  label: string;
  href: string;
}

export interface LinkListProps {
  items?: LinkListItem[];
  className?: string;
  dense?: boolean;
}

export interface LinkListRenderModel {
  runtime: 'react';
  tag: 'rd-link-list';
  props: Required<Pick<LinkListProps, 'items' | 'dense'>> &
    Pick<LinkListProps, 'className'>;
}

/**
 * Thin React-oriented adapter stub for the link-list recipe atom.
 * Richer JSX component follows in DAS-96.
 */
export function LinkList(props: LinkListProps = {}): LinkListRenderModel {
  return {
    runtime: 'react',
    tag: 'rd-link-list',
    props: {
      items: props.items ?? [],
      dense: props.dense ?? false,
      className: props.className,
    },
  };
}
