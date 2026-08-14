import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface DetailPanelProps {
  title?: string;
  emptyMessage?: string;
  className?: string;
}

/** @rosettadash/vue/visual/detail — visual.detail */
export const DetailPanel = defineComponent({
  name: 'RdDetailPanel',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
    emptyMessage: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-detail', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-detail' }, [
      h('header', { class: 'rd-detail__header' }, h('span', null, props.title ?? 'Details')),
      h('p', { class: 'rd-detail__empty' }, props.emptyMessage ?? 'Select a row to view details'),
      slots.default?.(),
    ]);
    };
  },
});

export type DetailPanelComponent = typeof DetailPanel;
