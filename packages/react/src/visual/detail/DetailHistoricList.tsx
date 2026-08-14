import { forwardRef, type CSSProperties } from 'react';

export interface DetailHistoricItem {
  label: string;
  value: string;
}

export interface DetailHistoricListProps {
  title: string;
  items: DetailHistoricItem[];
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** @rosettadash/react/visual/detail/detail-historic-list — visual.detail.detail-historic-list */
export const DetailHistoricList = forwardRef<HTMLElement, DetailHistoricListProps>(
  function DetailHistoricList({ title, items, compact, className, style }, ref) {
    const rootClass = ['rd-detail-historic', compact ? 'rd-detail-historic--compact' : '', className]
      .filter(Boolean)
      .join(' ');

    return (
      <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-detail-historic">
        <h4>{title}</h4>
        <ul>
          {items.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </li>
          ))}
        </ul>
      </section>
    );
  },
);
