import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface TextInputProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/** @rosettadash/vue/visual/input/text — visual.input.text */
export const TextInput = defineComponent({
  name: 'RdTextInput',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    label: { type: String as PropType<string | undefined>, default: undefined },
    placeholder: { type: String as PropType<string | undefined>, default: undefined },
    required: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    value: { type: String as PropType<string | undefined>, default: undefined },
    defaultValue: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-input-text', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-input-text' }, [
      props.label ? h('span', { class: 'rd-field__label' }, props.label) : null,
      h('input', { type: 'text', class: 'rd-input', placeholder: props.placeholder ?? '', required: props.required ?? false, value: props.value ?? '' }),
      slots.default?.(),
    ]);
    };
  },
});

export type TextInputComponent = typeof TextInput;
