import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface DateRangeFilterProps {
  label?: string;
  startDate?: string;
  endDate?: string;
  presetLabel?: string;
  onChange?: (range: { startDate: string; endDate: string }) => void;
  className?: string;
}

/** @rosettadash/vue/visual/input/date-range — visual.input.date-range */
export const DateRangeFilter = defineComponent({
  name: 'RdDateRangeFilter',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    label: { type: String as PropType<string | undefined>, default: undefined },
    startDate: { type: String as PropType<string | undefined>, default: undefined },
    endDate: { type: String as PropType<string | undefined>, default: undefined },
    presetLabel: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-input-date-range', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-input-date-range' }, [
      props.label ? h('span', { class: 'rd-field__label' }, props.label) : null,
      h('div', { class: 'rd-date-range__controls' }, [
        h('input', { type: 'date', class: 'rd-input', value: props.startDate ?? '' }),
        h('span', { class: 'rd-date-range__sep' }, 'to'),
        h('input', { type: 'date', class: 'rd-input', value: props.endDate ?? '' }),
      ]),
      props.presetLabel ? h('span', { class: 'rd-date-range__preset' }, props.presetLabel) : null,
      slots.default?.(),
    ]);
    };
  },
});

export type DateRangeFilterComponent = typeof DateRangeFilter;
