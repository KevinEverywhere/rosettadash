import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface ExpressServerInfraProps {
  label?: string;
  globalPrefix?: string;
  className?: string;
}

/** @rosettadash/vue/infra/server/express — infra.server.express */
export const ExpressServerInfra = defineComponent({
  name: 'RdExpressServerInfra',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    label: { type: String as PropType<string | undefined>, default: undefined },
    globalPrefix: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-server-express', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-server-express' }, [
      h('span', { class: 'rd-infra__badge' }, 'INFRA'),
      props.label ? h('span', { class: 'rd-field__label' }, props.label) : null,
      props.globalPrefix ? h('code', null, `globalPrefix: ${props.globalPrefix}`) : null,
      slots.default?.(),
    ]);
    };
  },
});

export type ExpressServerInfraComponent = typeof ExpressServerInfra;
