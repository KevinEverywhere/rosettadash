import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface SvgInlineProps {
  markup?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

/** @rosettadash/vue/visual/svg/inline — visual.svg.inline */
export const SvgInline = defineComponent({
  name: 'RdSvgInline',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    markup: { type: String as PropType<string | undefined>, default: undefined },
    width: { type: String as PropType<number | string | undefined>, default: undefined },
    height: { type: String as PropType<number | string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    const defaultSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/></svg>';
    return () => {
      const rootClass = ['rd-svg-inline', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('div', {
      class: rootClass,
      'data-testid': 'rd-svg-inline',
      style: { width: `${props.width ?? 96}px`, height: `${props.height ?? 96}px` },
      innerHTML: props.markup ?? defaultSvg,
    });
    };
  },
});

export type SvgInlineComponent = typeof SvgInline;
