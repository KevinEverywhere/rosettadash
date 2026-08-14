import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface DateRangeFilterProps {
  label?: string;
  startLabel?: string;
  endLabel?: string;
  startDate?: string;
  endDate?: string;
  /** Use month pickers (YYYY-MM) instead of full date inputs — cleaner calendar UX. */
  granularity?: 'date' | 'month';
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
  const inputType = props.granularity === 'month' ? 'month' : 'date';

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-input-date-range">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <div className="rd-date-range__controls">
        <label className="rd-date-range__field">
          {props.startLabel ? <span className="rd-date-range__field-label">{props.startLabel}</span> : null}
          <input
            type={inputType}
            className="rd-input rd-date-range__input"
            aria-label={props.startLabel ?? `${props.label ?? 'Date range'} start`}
            value={props.startDate}
            onChange={(e) =>
              props.onChange?.({ startDate: e.target.value, endDate: props.endDate ?? '' })
            }
          />
        </label>
        <span className="rd-date-range__sep">to</span>
        <label className="rd-date-range__field">
          {props.endLabel ? <span className="rd-date-range__field-label">{props.endLabel}</span> : null}
          <input
            type={inputType}
            className="rd-input rd-date-range__input"
            aria-label={props.endLabel ?? `${props.label ?? 'Date range'} end`}
            value={props.endDate}
            onChange={(e) =>
              props.onChange?.({ startDate: props.startDate ?? '', endDate: e.target.value })
            }
          />
        </label>
      </div>
      {props.presetLabel ? <span className="rd-date-range__preset">{props.presetLabel}</span> : null}
      {children}
    </section>
  );
});
