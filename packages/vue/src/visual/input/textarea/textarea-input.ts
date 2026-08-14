import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface TextareaInputProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/** @rosettadash/vue/visual/input/textarea — visual.input.textarea */
export const TextareaInput = defineComponent({
  name: 'RdTextareaInput',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    label: { type: String as PropType<string | undefined>, default: undefined },
    placeholder: { type: String as PropType<string | undefined>, default: undefined },
    rows: { type: Number as PropType<number | undefined>, default: undefined },
    value: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-input-textarea', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-input-textarea' }, [
      props.label ? h('span', { class: 'rd-field__label' }, props.label) : null,
      h('textarea', { class: 'rd-textarea', rows: props.rows ?? 4, placeholder: props.placeholder ?? '' }, props.value ?? ''),
      slots.default?.(),
    ]);
    };
  },
});

export type TextareaInputComponent = typeof TextareaInput;
