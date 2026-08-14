import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface FlexLayoutProps {
  title?: string;
  direction?: 'row' | 'column';
  gap?: number | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/layout/flex — layout.flex */
export const FlexLayout = forwardRef<HTMLElement, FlexLayoutProps>(function FlexLayout(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-flex', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-flex">
      {props.title ? <span className="rd-flex__title">{props.title}</span> : null}
      <div className="rd-flex__flex" style={{ flexDirection: props.direction ?? 'row', gap: props.gap ?? 12 }}>{children}</div>
    </section>
  );
});
