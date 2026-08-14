import { forwardRef, type CSSProperties } from 'react';

export interface DetailStatItem {
  label: string;
  value: string;
}

export interface DetailStatsProps {
  items: DetailStatItem[];
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** @rosettadash/react/visual/detail/detail-stats — visual.detail.detail-stats */
export const DetailStats = forwardRef<HTMLDListElement, DetailStatsProps>(function DetailStats(
  { items, compact, className, style },
  ref,
) {
  const rootClass = ['rd-detail-stats', compact ? 'rd-detail-stats--compact' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <dl ref={ref} className={rootClass} style={style} data-testid="rd-detail-stats">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
});
