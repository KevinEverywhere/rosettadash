import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface RoleAssignProps {
  summary?: string;
  roleOptions?: { value: string; label: string }[];
  onConfirm?: (role: string) => void;
  className?: string;
}

/** @rosettadash/vue/domain/role-assign — domain.role-assign */
export const RoleAssign = defineComponent({
  name: 'RdRoleAssign',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    summary: { type: String as PropType<string | undefined>, default: undefined },
    roleOptions: { type: Array as PropType<{ value: string; label: string }[] | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-role-assign', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-role-assign' }, [
      h('span', { class: 'rd-field__label' }, 'Assign role'),
      props.summary ? h('p', { class: 'rd-onboarding__summary' }, props.summary) : null,
      h('select', { class: 'rd-select' }, (props.roleOptions ?? []).map((o) => h('option', { key: o.value, value: o.value }, o.label))),
      h('button', { type: 'button', class: 'rd-button' }, 'Confirm access'),
      slots.default?.(),
    ]);
    };
  },
});

export type RoleAssignComponent = typeof RoleAssign;
