import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface PostgresqlInfraProps {
  label?: string;
  envKey?: string;
  tableOrCollection?: string;
  className?: string;
}

/** @rosettadash/vue/infra/postgresql — infra.postgresql */
export const PostgresqlInfra = defineComponent({
  name: 'RdPostgresqlInfra',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    label: { type: String as PropType<string | undefined>, default: undefined },
    envKey: { type: String as PropType<string | undefined>, default: undefined },
    tableOrCollection: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-postgresql', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-postgresql' }, [
      h('span', { class: 'rd-infra__badge' }, 'INFRA'),
      props.label ? h('span', { class: 'rd-field__label' }, props.label) : null,
      props.envKey ? h('code', null, props.envKey) : null,
      props.tableOrCollection ? h('span', { class: 'rd-infra__meta' }, props.tableOrCollection) : null,
      slots.default?.(),
    ]);
    };
  },
});

export type PostgresqlInfraComponent = typeof PostgresqlInfra;
