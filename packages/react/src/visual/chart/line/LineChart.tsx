import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface LineChartProps {
  title?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/chart/line — visual.chart.line */
export const LineChart = forwardRef<HTMLElement, LineChartProps>(function LineChart(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-chart-line', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-chart-line">
      <header className="rd-chart-line__header"><span>{props.title ?? 'Line chart'}</span></header>
      <svg viewBox="0 0 240 96" className="rd-chart-line__svg" aria-hidden="true">
        <polyline className="rd-chart-line__line" points="0,80 40,60 80,65 120,40 160,45 200,20 240,30" />
      </svg>
      {children}
    </section>
  );
});
