import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface BarChartProps {
  title?: string;
  className?: string;
}

/** @rosettadash/vue/visual/chart/bar — visual.chart.bar */
export const BarChart = defineComponent({
  name: 'RdBarChart',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    const barHeights = [40, 65, 55, 80, 48];
    return () => {
      const rootClass = ['rd-chart-bar', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-chart-bar' }, [
      h('header', { class: 'rd-chart-bar__header' }, h('span', null, props.title ?? 'Bar chart')),
      h('div', { class: 'rd-chart-bar__bars', 'aria-hidden': 'true' }, barHeights.map((height, i) =>
        h('div', { key: i, class: 'rd-chart-bar__bar-wrap' }, h('div', { class: 'rd-chart-bar__bar', style: { height: `${height}%` } })),
      )),
      slots.default?.(),
    ]);
    };
  },
});

export type BarChartComponent = typeof BarChart;
