import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface SvgInlineProps {
  markup?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/svg/inline — visual.svg.inline */
export const SvgInline = forwardRef<HTMLElement, SvgInlineProps>(function SvgInline(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-svg-inline', className].filter(Boolean).join(' ');

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={rootClass} style={{ width: props.width ?? 96, height: props.height ?? 96, ...style }} data-testid="rd-svg-inline" dangerouslySetInnerHTML={{ __html: props.markup ?? '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/></svg>' }} />
  );
});
