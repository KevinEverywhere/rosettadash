import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface BarChartBar {
  label: string;
  value: number;
}

export interface BarChartProps {
  title?: string;
  bars?: BarChartBar[];
  yAxisLabel?: string;
  valueFormat?: (value: number) => string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const FALLBACK_BARS: BarChartBar[] = [
  { label: 'A', value: 40 },
  { label: 'B', value: 65 },
  { label: 'C', value: 55 },
  { label: 'D', value: 80 },
  { label: 'E', value: 48 },
];

function defaultFormat(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return String(Math.round(value));
}

function buildTicks(max: number, count = 4): number[] {
  if (max <= 0) {
    return [0];
  }
  const step = max / (count - 1);
  return Array.from({ length: count }, (_, index) => step * index);
}

/** @rosettadash/react/visual/chart/bar — visual.chart.bar */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-chart-bar', className].filter(Boolean).join(' ');
  const bars = props.bars?.length ? props.bars : FALLBACK_BARS;
  const format = props.valueFormat ?? defaultFormat;
  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);
  const ticks = buildTicks(maxValue);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={rootClass}
      style={style}
      data-testid="rd-chart-bar"
      role="img"
      aria-label={props.title ?? 'Bar chart'}
    >
      <header className="rd-chart-bar__header">
        <span>{props.title ?? 'Bar chart'}</span>
      </header>
      <div className="rd-chart-bar__body">
        <div className="rd-chart-bar__y-axis" aria-hidden="true">
          <div className="rd-chart-bar__y-ticks">
            {[...ticks].reverse().map((tick) => (
              <span key={tick} className="rd-chart-bar__y-tick">
                {format(tick)}
              </span>
            ))}
          </div>
          {props.yAxisLabel ? (
            <span className="rd-chart-bar__y-label">{props.yAxisLabel}</span>
          ) : null}
        </div>
        <div className="rd-chart-bar__plot">
          <div className="rd-chart-bar__grid-lines" aria-hidden="true">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="rd-chart-bar__grid-line"
                style={{ bottom: `${(tick / maxValue) * 100}%` }}
              />
            ))}
          </div>
          <div className="rd-chart-bar__bars">
            {bars.map((bar) => {
              const heightPct = (bar.value / maxValue) * 100;
              return (
                <div key={bar.label} className="rd-chart-bar__bar-group">
                  <div className="rd-chart-bar__bar-wrap">
                    <div
                      className="rd-chart-bar__bar"
                      style={{ height: `${heightPct}%` }}
                      title={`${bar.label}: ${format(bar.value)}`}
                    />
                  </div>
                  <span className="rd-chart-bar__x-label">{bar.label}</span>
                  <span className="rd-chart-bar__value">{format(bar.value)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
});
