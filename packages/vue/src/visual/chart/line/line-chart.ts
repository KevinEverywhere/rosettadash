import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface LineChartProps {
  title?: string;
  className?: string;
}

/** @rosettadash/vue/visual/chart/line — visual.chart.line */
export const LineChart = defineComponent({
  name: 'RdLineChart',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-chart-line', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-chart-line' }, [
      h('header', { class: 'rd-chart-line__header' }, h('span', null, props.title ?? 'Line chart')),
      h('svg', { viewBox: '0 0 240 96', class: 'rd-chart-line__svg', 'aria-hidden': 'true' }, [
        h('polyline', { class: 'rd-chart-line__line', points: '0,80 40,60 80,65 120,40 160,45 200,20 240,30' }),
      ]),
      slots.default?.(),
    ]);
    };
  },
});

export type LineChartComponent = typeof LineChart;
