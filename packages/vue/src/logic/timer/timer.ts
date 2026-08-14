import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface TimerProps {
  label?: string;
  mode?: 'interval' | 'countdown';
  intervalMs?: number;
  tickCount?: number;
  className?: string;
}

/** @rosettadash/vue/logic/timer — logic.timer */
export const Timer = defineComponent({
  name: 'RdTimer',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    label: { type: String as PropType<string | undefined>, default: undefined },
    mode: { type: String as PropType<'interval' | 'countdown' | undefined>, default: undefined },
    intervalMs: { type: Number as PropType<number | undefined>, default: undefined },
    tickCount: { type: Number as PropType<number | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-timer', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-timer' }, [
      props.label ? h('span', { class: 'rd-timer__label' }, props.label) : null,
      h('span', { class: 'rd-timer__value' }, `${props.tickCount ?? 0} ticks`),
      slots.default?.(),
    ]);
    };
  },
});

export type TimerComponent = typeof Timer;
