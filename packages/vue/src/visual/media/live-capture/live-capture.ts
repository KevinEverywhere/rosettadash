import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface LiveCaptureProps {
  label?: string;
  onStart?: () => void;
  className?: string;
}

/** @rosettadash/vue/visual/media/live-capture — visual.media.live-capture */
export const LiveCapture = defineComponent({
  name: 'RdLiveCapture',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    label: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-media-live-capture', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-media-live-capture' }, [
      h('span', { class: 'rd-media__label' }, props.label ?? 'Live capture'),
      h('button', { type: 'button', class: 'rd-button' }, 'Start camera'),
      slots.default?.(),
    ]);
    };
  },
});

export type LiveCaptureComponent = typeof LiveCapture;
