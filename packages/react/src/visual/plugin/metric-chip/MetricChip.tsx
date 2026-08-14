import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface MetricChipProps {
  chipLabel?: string;
  chipValue?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/plugin/metric-chip — visual.plugin.metric-chip */
export const MetricChip = forwardRef<HTMLElement, MetricChipProps>(function MetricChip(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-plugin-metric-chip', className].filter(Boolean).join(' ');

  return (
    <span ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-plugin-metric-chip">
      <span className="rd-plugin-metric-chip__label">{props.chipLabel ?? 'Metric'}</span>
      <span className="rd-plugin-metric-chip__value">{props.chipValue ?? '—'}</span>
    </span>
  );
});
