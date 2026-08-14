import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface GridLayoutProps {
  title?: string;
  columns?: number;
  gap?: number | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/layout/grid — layout.grid */
export const GridLayout = forwardRef<HTMLElement, GridLayoutProps>(function GridLayout(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-grid', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-grid">
      {props.title ? <span className="rd-grid__title">{props.title}</span> : null}
      <div className="rd-grid__grid" style={{ gridTemplateColumns: `repeat(${props.columns ?? 3}, 1fr)`, gap: props.gap ?? 12 }}>{children}</div>
    </section>
  );
});
