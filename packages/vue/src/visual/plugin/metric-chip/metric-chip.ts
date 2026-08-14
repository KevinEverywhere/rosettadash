import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface MetricChipProps {
  chipLabel?: string;
  chipValue?: string;
  className?: string;
}

/** @rosettadash/vue/visual/plugin/metric-chip — visual.plugin.metric-chip */
export const MetricChip = defineComponent({
  name: 'RdMetricChip',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    chipLabel: { type: String as PropType<string | undefined>, default: undefined },
    chipValue: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-plugin-metric-chip', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('span', { class: rootClass, 'data-testid': 'rd-plugin-metric-chip' }, [
      h('span', { class: 'rd-plugin-metric-chip__label' }, props.chipLabel ?? 'Metric'),
      h('span', { class: 'rd-plugin-metric-chip__value' }, props.chipValue ?? '—'),
    ]);
    };
  },
});

export type MetricChipComponent = typeof MetricChip;
