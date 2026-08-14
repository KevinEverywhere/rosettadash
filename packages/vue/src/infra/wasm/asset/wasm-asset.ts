import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface WasmAssetProps {
  assetPath?: string;
  gluePath?: string;
  className?: string;
}

/** @rosettadash/vue/infra/wasm/asset — infra.wasm.asset */
export const WasmAsset = defineComponent({
  name: 'RdWasmAsset',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    assetPath: { type: String as PropType<string | undefined>, default: undefined },
    gluePath: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-wasm-asset', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', { class: rootClass, 'data-testid': 'rd-wasm-asset' }, [
      h('span', { class: 'rd-wasm__badge' }, 'WASM'),
      h('code', null, props.assetPath ?? 'wasm/modules/example.wasm'),
      props.gluePath ? h('span', { class: 'rd-wasm__glue' }, `+ ${props.gluePath}`) : null,
      slots.default?.(),
    ]);
    };
  },
});

export type WasmAssetComponent = typeof WasmAsset;
