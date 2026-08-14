import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface DateRangeFilterProps {
  label?: string;
  startDate?: string;
  endDate?: string;
  presetLabel?: string;
  onChange?: (range: { startDate: string; endDate: string }) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/input/date-range — visual.input.date-range */
export const DateRangeFilter = forwardRef<HTMLElement, DateRangeFilterProps>(function DateRangeFilter(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-input-date-range', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-input-date-range">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <div className="rd-date-range__controls">
        <input type="date" className="rd-input" value={props.startDate} onChange={(e) => props.onChange?.({ startDate: e.target.value, endDate: props.endDate ?? '' })} />
        <span className="rd-date-range__sep">to</span>
        <input type="date" className="rd-input" value={props.endDate} onChange={(e) => props.onChange?.({ startDate: props.startDate ?? '', endDate: e.target.value })} />
      </div>
      {props.presetLabel ? <span className="rd-date-range__preset">{props.presetLabel}</span> : null}
      {children}
    </section>
  );
});
