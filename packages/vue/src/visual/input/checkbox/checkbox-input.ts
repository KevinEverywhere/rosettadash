import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface CheckboxInputProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

/** @rosettadash/vue/visual/input/checkbox — visual.input.checkbox */
export const CheckboxInput = defineComponent({
  name: 'RdCheckboxInput',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    label: { type: String as PropType<string | undefined>, default: undefined },
    checked: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultChecked: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-input-checkbox', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('label', { class: rootClass + ' rd-field--checkbox', 'data-testid': 'rd-input-checkbox' }, [
      h('input', { type: 'checkbox', class: 'rd-checkbox', checked: props.checked ?? props.defaultChecked ?? false }),
      props.label ? h('span', { class: 'rd-field__label' }, props.label) : null,
      slots.default?.(),
    ]);
    };
  },
});

export type CheckboxInputComponent = typeof CheckboxInput;
