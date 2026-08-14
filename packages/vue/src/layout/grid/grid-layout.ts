import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface GridLayoutProps {
  title?: string;
  columns?: number;
  gap?: number | string;
  className?: string;
}

/** @rosettadash/vue/layout/grid — layout.grid */
export const GridLayout = defineComponent({
  name: 'RdGridLayout',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
    columns: { type: Number as PropType<number | undefined>, default: undefined },
    gap: { type: String as PropType<number | string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    function gridColumns(): string {
      return `repeat(${props.columns ?? 3}, 1fr)`;
    }
    function gridGap(): number {
      return typeof props.gap === 'number' ? props.gap : 12;
    }
    return () => {
      const rootClass = ['rd-grid', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-grid' }, [
      props.title ? h('span', { class: 'rd-grid__title' }, props.title) : null,
      h('div', { class: 'rd-grid__grid', style: { gridTemplateColumns: gridColumns(), gap: `${gridGap()}px` } }, slots.default?.()),
    ]);
    };
  },
});

export type GridLayoutComponent = typeof GridLayout;
