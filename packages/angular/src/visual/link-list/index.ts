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
  runtime: 'angular';
  tag: 'rd-link-list';
  props: Required<Pick<LinkListProps, 'items' | 'dense'>> &
    Pick<LinkListProps, 'className'>;
}

/** Thin angular adapter stub — locks export path for DAS-94 recipes. */
export function LinkList(props: LinkListProps = {}): LinkListRenderModel {
  return {
    runtime: 'angular',
    tag: 'rd-link-list',
    props: {
      items: props.items ?? [],
      dense: props.dense ?? false,
      className: props.className,
    },
  };
}
