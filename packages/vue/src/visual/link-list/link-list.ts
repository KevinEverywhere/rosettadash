import { defineComponent, h, type PropType } from 'vue';

/** Single link item for visual/link-list. */
export interface LinkListItem {
  label: string;
  href: string;
}

/** Public props contract for visual/link-list (parity with web-components). */
export interface LinkListProps {
  items?: LinkListItem[];
  className?: string;
  dense?: boolean;
}

export const LinkList = defineComponent({
  name: 'RdLinkList',
  props: {
    items: {
      type: Array as PropType<LinkListItem[]>,
      default: () => [],
    },
    className: { type: String as PropType<string | undefined>, default: undefined },
    dense: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    return () => {
      const rootClass = [
        'rd-link-list',
        props.dense ? 'rd-link-list--dense' : '',
        props.className ?? '',
        typeof attrs.class === 'string' ? attrs.class : '',
      ]
        .filter(Boolean)
        .join(' ');

      return h(
        'ul',
        {
          class: rootClass,
          'data-testid': 'rd-link-list',
        },
        (props.items ?? []).map((item) =>
          h('li', { class: 'rd-link-list__item', key: `${item.href}:${item.label}` }, [
            h(
              'a',
              {
                class: 'rd-link-list__link',
                href: item.href,
              },
              item.label,
            ),
          ]),
        ),
      );
    };
  },
});

export type LinkListComponent = typeof LinkList;
