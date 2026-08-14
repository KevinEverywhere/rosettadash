import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface DetailPanelProps {
  title?: string;
  emptyMessage?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/detail — visual.detail */
export const DetailPanel = forwardRef<HTMLElement, DetailPanelProps>(function DetailPanel(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-detail', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-detail">
      <header className="rd-detail__header"><span>{props.title ?? 'Details'}</span></header>
      <p className="rd-detail__empty">{props.emptyMessage ?? 'Select a row to view details'}</p>
      {children}
    </section>
  );
});
