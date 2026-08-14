import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface WasmWorkerHostProps {
  workerLabel?: string;
  workerStatus?: string;
  className?: string;
}

/** @rosettadash/vue/visual/wasm/worker-host — visual.wasm.worker-host */
export const WasmWorkerHost = defineComponent({
  name: 'RdWasmWorkerHost',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    workerLabel: { type: String as PropType<string | undefined>, default: undefined },
    workerStatus: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-wasm-worker-host', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-wasm-worker-host' }, [
      h('span', { class: 'rd-wasm__label' }, props.workerLabel ?? 'Worker'),
      h('span', { class: 'rd-wasm__status' }, props.workerStatus ?? 'Idle'),
      slots.default?.(),
    ]);
    };
  },
});

export type WasmWorkerHostComponent = typeof WasmWorkerHost;
