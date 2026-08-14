import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface SvgIconProps {
  markup?: string;
  title?: string;
  color?: string;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/svg/icon — visual.svg.icon */
export const SvgIcon = forwardRef<HTMLElement, SvgIconProps>(function SvgIcon(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-svg-icon', className].filter(Boolean).join(' ');

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={rootClass} style={{ width: props.size ?? 28, height: props.size ?? 28, color: props.color, ...style }} data-testid="rd-svg-icon" title={props.title} dangerouslySetInnerHTML={{ __html: props.markup ?? '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" fill="currentColor"/></svg>' }} />
  );
});
