import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface PieChartProps {
  title?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/chart/pie — visual.chart.pie */
export const PieChart = forwardRef<HTMLElement, PieChartProps>(function PieChart(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-chart-pie', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-chart-pie">
      <header className="rd-chart-pie__header"><span>{props.title ?? 'Pie chart'}</span></header>
      <div className="rd-chart-pie__pie" aria-hidden="true" />
      {children}
    </section>
  );
});
