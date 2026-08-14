import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface ThreeGeoGlobeProps {
  title?: string;
  mode?: string;
  className?: string;
}

/** @rosettadash/vue/visual/display/3d-geo-globe — visual.display.3d-geo-globe */
export const ThreeGeoGlobe = defineComponent({
  name: 'RdThreeGeoGlobe',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
    mode: { type: String as PropType<string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    return () => {
      const rootClass = ['rd-display-3d-geo-globe', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('section', {
      class: rootClass,
      'data-testid': 'rd-display-3d-geo-globe',
      'data-three-mode': props.mode,
      'data-three-title': props.title,
      'aria-label': props.title ?? '3D host',
    }, slots.default?.());
    };
  },
});

export type ThreeGeoGlobeComponent = typeof ThreeGeoGlobe;
