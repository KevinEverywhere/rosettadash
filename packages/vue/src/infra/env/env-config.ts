import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface EnvConfigProps {
  envKeys?: string;
  className?: string;
}

/** @rosettadash/vue/infra/env — infra.env */
export const EnvConfig = defineComponent({
  name: 'RdEnvConfig',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    envKeys: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-env', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-env' }, [
      h('span', { class: 'rd-infra__badge' }, 'INFRA'),
      h('span', { class: 'rd-field__label' }, 'Environment config'),
      h('code', null, props.envKeys ?? 'DATABASE_URL, API_KEY'),
      slots.default?.(),
    ]);
    };
  },
});

export type EnvConfigComponent = typeof EnvConfig;
