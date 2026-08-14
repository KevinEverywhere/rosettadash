import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface ThreeBarChartProps {
  title?: string;
  mode?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/display/3d-bar-chart — visual.display.3d-bar-chart */
export const ThreeBarChart = forwardRef<HTMLElement, ThreeBarChartProps>(function ThreeBarChart(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-display-3d-bar-chart', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-display-3d-bar-chart" data-three-mode={props.mode} data-three-title={props.title} aria-label={props.title ?? '3D host'}>{children}</section>
  );
});
