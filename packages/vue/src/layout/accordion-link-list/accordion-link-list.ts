import { defineComponent, h, type PropType } from 'vue';
import { Accordion } from '../accordion/accordion';
import {
  LinkList,
  type LinkListItem,
} from '../../visual/link-list/link-list';

/** Public props for the accordion + link-list recipe. */
export interface AccordionLinkListProps {
  title: string;
  /** Controlled open state — use with `v-model:open`. */
  open?: boolean;
  defaultOpen?: boolean;
  className?: string;
  items?: LinkListItem[];
  dense?: boolean;
}

/**
 * Recipe: collapsible nav / TOC composed from Accordion + LinkList.
 * Prefer this helper when the accordion only wraps a link list.
 */
export const AccordionLinkList = defineComponent({
  name: 'RdAccordionLinkList',
  props: {
    title: { type: String, required: true },
    open: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    defaultOpen: { type: Boolean, default: false },
    className: { type: String as PropType<string | undefined>, default: undefined },
    items: {
      type: Array as PropType<LinkListItem[]>,
      default: () => [],
    },
    dense: { type: Boolean, default: false },
  },
  emits: {
    'update:open': (_open: boolean) => true,
    toggle: (_open: boolean) => true,
  },
  setup(props, { emit }) {
    return () =>
      h(
        Accordion,
        {
          title: props.title,
          open: props.open,
          defaultOpen: props.defaultOpen,
          className: ['rd-accordion-link-list', props.className]
            .filter(Boolean)
            .join(' '),
          'onUpdate:open': (next: boolean) => emit('update:open', next),
          onToggle: (next: boolean) => emit('toggle', next),
        },
        {
          default: () =>
            h(LinkList, {
              items: props.items,
              dense: props.dense,
            }),
        },
      );
  },
});

export type AccordionLinkListComponent = typeof AccordionLinkList;
