import { forwardRef, type CSSProperties } from 'react';

export interface FilterSummaryChip {
  label: string;
  value: string;
}

export interface FilterSummaryProps {
  title?: string;
  count: number;
  countNoun?: string;
  chips: FilterSummaryChip[];
  hint?: string;
  className?: string;
  style?: CSSProperties;
}

/** @rosettadash/react/visual/filter/filter-summary — visual.filter.filter-summary */
export const FilterSummary = forwardRef<HTMLElement, FilterSummaryProps>(function FilterSummary(
  { title = 'Filter results', count, countNoun = 'result', chips, hint, className, style },
  ref,
) {
  const rootClass = ['rd-filter-summary', className].filter(Boolean).join(' ');
  const plural = count === 1 ? countNoun : `${countNoun}s`;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={rootClass}
      style={style}
      data-testid="rd-filter-summary"
      aria-live="polite"
    >
      <div className="rd-filter-summary__header">
        <strong>{title}</strong>
        <span className="rd-filter-summary__count">
          {count} {plural}
        </span>
      </div>
      <dl className="rd-filter-summary__chips">
        {chips.map((chip) => (
          <div key={chip.label}>
            <dt>{chip.label}</dt>
            <dd>{chip.value}</dd>
          </div>
        ))}
      </dl>
      {hint ? <p className="rd-filter-summary__hint">{hint}</p> : null}
    </section>
  );
});
