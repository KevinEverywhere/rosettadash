import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface StatusBadgeProps {
  statusText?: string;
  tone?: 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/plugin/status-badge — visual.plugin.status-badge */
export const StatusBadge = forwardRef<HTMLElement, StatusBadgeProps>(function StatusBadge(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-plugin-status-badge', className].filter(Boolean).join(' ');

  return (
    <span ref={ref as React.RefObject<HTMLElement>} className={[rootClass, `rd-status-badge--${props.tone ?? 'success'}`].join(' ')} style={style} data-testid="rd-plugin-status-badge">{props.statusText ?? 'Active'}</span>
  );
});
