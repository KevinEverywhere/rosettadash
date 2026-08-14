import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface TimerProps {
  label?: string;
  mode?: 'interval' | 'countdown';
  intervalMs?: number;
  tickCount?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/logic/timer — logic.timer */
export const Timer = forwardRef<HTMLElement, TimerProps>(function Timer(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-timer', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-timer">
      {props.label ? <span className="rd-timer__label">{props.label}</span> : null}
      <span className="rd-timer__value">{props.tickCount ?? 0} ticks</span>
      {children}
    </section>
  );
});
