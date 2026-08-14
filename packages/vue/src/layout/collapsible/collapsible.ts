import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface CollapsibleProps {
  title?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** @rosettadash/vue/layout/collapsible — layout.collapsible */
export const Collapsible = defineComponent({
  name: 'RdCollapsible',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-collapsible', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-collapsible' }, [
      h('button', { type: 'button', class: 'rd-collapsible__header', 'aria-expanded': props.open ?? props.defaultOpen ?? false ? 'true' : 'false' }, [
        h('span', null, props.title ?? 'Section'),
      ]),
      h('div', { class: 'rd-collapsible__panel' }, slots.default?.()),
    ]);
    };
  },
});

export type CollapsibleComponent = typeof Collapsible;
