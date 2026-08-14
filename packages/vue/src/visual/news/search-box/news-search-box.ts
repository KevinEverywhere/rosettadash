import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface NewsSearchBoxProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

/** @rosettadash/vue/visual/news/search-box — visual.news.search-box */
export const NewsSearchBox = defineComponent({
  name: 'RdNewsSearchBox',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    label: { type: String as PropType<string | undefined>, default: undefined },
    placeholder: { type: String as PropType<string | undefined>, default: undefined },
    value: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-news-search-box', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-news-search-box' }, [
      props.label ? h('span', { class: 'rd-field__label' }, props.label) : null,
      h('div', { class: 'rd-search__row' }, [
        h('input', { type: 'search', class: 'rd-input', placeholder: props.placeholder ?? 'Search news…', value: props.value ?? '' }),
        h('button', { type: 'button', class: 'rd-button' }, 'Search'),
      ]),
      slots.default?.(),
    ]);
    };
  },
});

export type NewsSearchBoxComponent = typeof NewsSearchBox;
