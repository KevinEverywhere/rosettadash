import { defineComponent, h, type PropType, type SlotsType, type VNode } from 'vue';

export interface SvgIconProps {
  markup?: string;
  title?: string;
  color?: string;
  size?: number | string;
  className?: string;
}

/** @rosettadash/vue/visual/svg/icon — visual.svg.icon */
export const SvgIcon = defineComponent({
  name: 'RdSvgIcon',
  props: {
    className: { type: String as PropType<string | undefined>, default: undefined },
    markup: { type: String as PropType<string | undefined>, default: undefined },
    title: { type: String as PropType<string | undefined>, default: undefined },
    color: { type: String as PropType<string | undefined>, default: undefined },
    size: { type: String as PropType<number | string | undefined>, default: undefined },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots, attrs }) {
    const defaultIconSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" fill="currentColor"/></svg>';
    return () => {
      const rootClass = ['rd-svg-icon', props.className, typeof attrs.class === 'string' ? attrs.class : ''].filter(Boolean).join(' ');
      return h('span', {
      class: rootClass,
      'data-testid': 'rd-svg-icon',
      style: { width: `${props.size ?? 28}px`, height: `${props.size ?? 28}px`, color: props.color },
      title: props.title ?? '',
      innerHTML: props.markup ?? defaultIconSvg,
    });
    };
  },
});

export type SvgIconComponent = typeof SvgIcon;
