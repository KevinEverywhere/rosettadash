import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface PieChartProps {
  title?: string;
  className?: string;
}

/** @rosettadash/vue/visual/chart/pie — visual.chart.pie */
export const PieChart = defineComponent({
  name: 'RdPieChart',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-chart-pie', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-chart-pie' }, [
      h('header', { class: 'rd-chart-pie__header' }, h('span', null, props.title ?? 'Pie chart')),
      h('div', { class: 'rd-chart-pie__pie', 'aria-hidden': 'true' }),
      slots.default?.(),
    ]);
    };
  },
});

export type PieChartComponent = typeof PieChart;
