import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface KpiCardProps {
  title?: string;
  value?: string | number;
  delta?: string;
  format?: 'number' | 'currency' | 'percent';
  className?: string;
}

/** @rosettadash/vue/visual/kpi — visual.kpi */
export const KpiCard = defineComponent({
  name: 'RdKpiCard',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
    value: { type: String as PropType<string | number | undefined>, default: undefined },
    delta: { type: String as PropType<string | undefined>, default: undefined },
    format: { type: String as PropType<'number' | 'currency' | 'percent' | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-kpi', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('article', { class: rootClass, 'data-testid': 'rd-kpi' }, [
      h('span', { class: 'rd-kpi__title' }, props.title ?? 'Metric'),
      h('span', { class: 'rd-kpi__value' }, String(props.value ?? '—')),
      props.delta ? h('span', { class: 'rd-kpi__delta' }, props.delta) : null,
      slots.default?.(),
    ]);
    };
  },
});

export type KpiCardComponent = typeof KpiCard;
