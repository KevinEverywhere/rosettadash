import { defineComponent, h, computed, type PropType, type SlotsType, type VNode } from 'vue';

export interface WasmModuleProps {
  moduleLabel?: string;
  exportName?: string;
  className?: string;
}

/** @rosettadash/vue/visual/wasm/module — visual.wasm.module */
export const WasmModule = defineComponent({
  name: 'RdWasmModule',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    moduleLabel: { type: String as PropType<string | undefined>, default: undefined },
    exportName: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    const exportFn = computed(() => props.exportName);
    return () => {
      const rootClass = ['rd-wasm-module', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-wasm-module' }, [
      h('span', { class: 'rd-wasm__label' }, props.moduleLabel ?? 'WASM Module'),
      h('code', null, `${exportFn.value ?? 'run()'}()`),
      slots.default?.(),
    ]);
    };
  },
});

export type WasmModuleComponent = typeof WasmModule;
