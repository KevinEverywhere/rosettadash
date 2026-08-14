import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface DataTableRow {
  id: string;
  name?: string;
  status?: string;
  amount?: number;
  date?: string;
  [key: string]: string | number | undefined;
}

export interface DataTableProps {
  title?: string;
  rows?: DataTableRow[];
  className?: string;
}

/** @rosettadash/vue/visual/table — visual.table */
export const DataTable = defineComponent({
  name: 'RdDataTable',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
    rows: { type: Array as PropType<DataTableRow[] | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-table', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-table' }, [
      h('header', { class: 'rd-table__header' }, h('span', null, props.title ?? 'Data table')),
      h('table', { class: 'rd-table__table' }, [
        h('thead', null, h('tr', null, ['Name', 'Status', 'Amount', 'Date'].map((col) => h('th', { key: col }, col)))),
        h('tbody', null, (props.rows ?? []).map((row) =>
          h('tr', { key: row.id }, [
            h('td', null, row.name),
            h('td', null, row.status),
            h('td', null, row.amount),
            h('td', null, row.date),
          ]),
        )),
      ]),
      slots.default?.(),
    ]);
    };
  },
});

export type DataTableComponent = typeof DataTable;
