import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface NewsResultsTableProps {
  title?: string;
  className?: string;
}

/** @rosettadash/vue/visual/news/results-table — visual.news.results-table */
export const NewsResultsTable = defineComponent({
  name: 'RdNewsResultsTable',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-news-results-table', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-news-results-table' }, [
      h('header', { class: 'rd-table__header' }, h('span', null, props.title ?? 'News results')),
      h('table', { class: 'rd-table' }, [
        h('thead', null, h('tr', null, ['Headline', 'Source', 'Region', 'Published'].map((col) => h('th', { key: col }, col)))),
        h('tbody'),
      ]),
      slots.default?.(),
    ]);
    };
  },
});

export type NewsResultsTableComponent = typeof NewsResultsTable;
