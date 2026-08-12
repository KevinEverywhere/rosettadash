import {
  computed,
  defineComponent,
  h,
  ref,
  watch,
  type PropType,
  type SlotsType,
  type VNode,
} from 'vue';

/** Public props contract for layout/accordion (parity with web-components). */
export interface AccordionProps {
  title: string;
  /** Controlled open state — use with `v-model:open`. */
  open?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export const Accordion = defineComponent({
  name: 'RdAccordion',
  props: {
    title: { type: String, required: true },
    // default undefined so absent ≠ false (Vue Boolean casting)
    open: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    defaultOpen: { type: Boolean, default: false },
    className: { type: String as PropType<string | undefined>, default: undefined },
  },
  emits: {
    'update:open': (_open: boolean) => true,
    toggle: (_open: boolean) => true,
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { emit, slots, attrs }) {
    const uncontrolledOpen = ref(props.defaultOpen);

    watch(
      () => props.defaultOpen,
      (next) => {
        if (props.open === undefined) {
          uncontrolledOpen.value = next;
        }
      },
    );

    const isOpen = computed(() =>
      props.open !== undefined ? props.open : uncontrolledOpen.value,
    );

    function setOpen(next: boolean): void {
      if (props.open === undefined) {
        uncontrolledOpen.value = next;
      }
      emit('update:open', next);
      emit('toggle', next);
    }

    function onToggle(): void {
      setOpen(!isOpen.value);
    }

    return () => {
      const rootClass = [
        'rd-accordion',
        isOpen.value ? 'rd-accordion--open' : '',
        props.className ?? '',
        typeof attrs.class === 'string' ? attrs.class : '',
      ]
        .filter(Boolean)
        .join(' ');

      return h(
        'section',
        {
          class: rootClass,
          'data-testid': 'rd-accordion',
        },
        [
          h(
            'button',
            {
              type: 'button',
              class: 'rd-accordion__header',
              'aria-expanded': isOpen.value ? 'true' : 'false',
              'aria-controls': 'rd-accordion-panel',
              onClick: onToggle,
            },
            [
              h('span', { class: 'rd-accordion__title' }, props.title),
              h('span', { class: 'rd-accordion__chevron', 'aria-hidden': 'true' }, '›'),
            ],
          ),
          isOpen.value
            ? h(
                'div',
                {
                  class: 'rd-accordion__panel',
                  id: 'rd-accordion-panel',
                  role: 'region',
                },
                slots.default?.(),
              )
            : null,
        ],
      );
    };
  },
});

export type AccordionComponent = typeof Accordion;
