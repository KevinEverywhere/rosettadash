import { defineComponent, h, computed, type PropType, type SlotsType, type VNode } from 'vue';

export interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

/** @rosettadash/vue/visual/skeleton — visual.skeleton */
export const LoadingSkeleton = defineComponent({
  name: 'RdLoadingSkeleton',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    lines: { type: Number as PropType<number | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    const skeletonLines = computed(() => {
      const count = props.lines ?? 4;
      return Array.from({ length: count }, (_, i) =>
        ['rd-skeleton__line', i === 2 ? 'rd-skeleton__line--short' : ''].filter(Boolean).join(' '),
      );
    });
    return () => {
      const rootClass = ['rd-skeleton', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-skeleton' }, [
      ...skeletonLines.value.map((line, i) => h('span', { key: i, class: line })),
      slots.default?.(),
    ]);
    };
  },
});

export type LoadingSkeletonComponent = typeof LoadingSkeleton;
