import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface KpiCardProps {
  title?: string;
  value?: string | number;
  delta?: string;
  format?: 'number' | 'currency' | 'percent';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/kpi — visual.kpi */
export const KpiCard = forwardRef<HTMLElement, KpiCardProps>(function KpiCard(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-kpi', className].filter(Boolean).join(' ');

  return (
    <article ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-kpi">
      <span className="rd-kpi__title">{props.title ?? 'Metric'}</span>
      <span className="rd-kpi__value">{props.value ?? '—'}</span>
      {props.delta ? <span className="rd-kpi__delta">{props.delta}</span> : null}
      {children}
    </article>
  );
});
