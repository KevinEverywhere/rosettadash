import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface RoleGateProps {
  label?: string;
  allowedRoles?: string[];
  statusText?: string;
  className?: string;
}

/** @rosettadash/vue/domain/role-gate — domain.role-gate */
export const RoleGate = defineComponent({
  name: 'RdRoleGate',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    label: { type: String as PropType<string | undefined>, default: undefined },
    allowedRoles: { type: Array as PropType<string[] | undefined>, default: undefined },
    statusText: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-role-gate', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-role-gate' }, [
      props.label ? h('span', { class: 'rd-field__label' }, props.label) : null,
      h('p', { class: 'rd-role-gate__status' }, props.statusText ?? 'Visible'),
      slots.default?.(),
    ]);
    };
  },
});

export type RoleGateComponent = typeof RoleGate;
