import { defineComponent, h, computed, type PropType, type SlotsType, type VNode } from 'vue';

export interface StatusBadgeProps {
  statusText?: string;
  tone?: 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

/** @rosettadash/vue/visual/plugin/status-badge — visual.plugin.status-badge */
export const StatusBadge = defineComponent({
  name: 'RdStatusBadge',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    statusText: { type: String as PropType<string | undefined>, default: undefined },
    tone: { type: String as PropType<'success' | 'warning' | 'error' | 'neutral' | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    const badgeClass = computed(() =>
      ['rd-plugin-status-badge', 'rd-plugin-status-badge--' + (props.tone ?? 'success'), props.className].filter(Boolean).join(' '),
    );
    return () => {
      const rootClass = ['rd-plugin-status-badge', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('span', { class: badgeClass.value, 'data-testid': 'rd-plugin-status-badge' }, props.statusText ?? 'Active');
    };
  },
});

export type StatusBadgeComponent = typeof StatusBadge;
