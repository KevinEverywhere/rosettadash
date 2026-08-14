import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface ModalLayoutProps {
  title?: string;
  body?: string;
  confirmLabel?: string;
  open?: boolean;
  onConfirm?: () => void;
  className?: string;
}

/** @rosettadash/vue/layout/modal — layout.modal */
export const ModalLayout = defineComponent({
  name: 'RdModalLayout',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
    body: { type: String as PropType<string | undefined>, default: undefined },
    confirmLabel: { type: String as PropType<string | undefined>, default: undefined },
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-modal', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-modal', role: 'dialog', 'aria-modal': 'true' }, [
      h('div', { class: 'rd-modal__dialog' }, [
        h('span', { class: 'rd-modal__title' }, props.title ?? 'Dialog'),
        props.body ? h('p', { class: 'rd-modal__body' }, props.body) : null,
        h('button', { type: 'button', class: 'rd-modal__confirm' }, props.confirmLabel ?? 'Confirm'),
        slots.default?.(),
      ]),
    ]);
    };
  },
});

export type ModalLayoutComponent = typeof ModalLayout;
