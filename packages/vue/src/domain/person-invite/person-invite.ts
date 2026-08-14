import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface PersonInviteProps {
  emailPlaceholder?: string;
  onInvite?: (email: string) => void;
  className?: string;
}

/** @rosettadash/vue/domain/person-invite — domain.person-invite */
export const PersonInvite = defineComponent({
  name: 'RdPersonInvite',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    emailPlaceholder: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-person-invite', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-person-invite' }, [
      h('span', { class: 'rd-field__label' }, 'Invite team member'),
      h('input', { type: 'email', class: 'rd-input', placeholder: props.emailPlaceholder ?? 'name@company.com' }),
      h('button', { type: 'button', class: 'rd-button' }, 'Send invite'),
      slots.default?.(),
    ]);
    };
  },
});

export type PersonInviteComponent = typeof PersonInvite;
