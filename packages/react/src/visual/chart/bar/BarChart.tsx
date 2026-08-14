import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface BarChartProps {
  title?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/chart/bar — visual.chart.bar */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-chart-bar', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-chart-bar">
      <header className="rd-chart-bar__header"><span>{props.title ?? 'Bar chart'}</span></header>
      <div className="rd-chart-bar__bars" aria-hidden="true">
        {[40, 65, 55, 80, 48].map((h, i) => (
          <div key={i} className="rd-chart-bar__bar-wrap"><div className="rd-chart-bar__bar" style={{ height: `${h}%` }} /></div>
        ))}
      </div>
      {children}
    </section>
  );
});
