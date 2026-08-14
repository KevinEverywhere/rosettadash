import { type CSSProperties, type ReactNode } from 'react';

export interface FilterGridProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function FilterGridRoot({ className, style, children }: FilterGridProps) {
  const rootClass = ['rd-filter-grid', className].filter(Boolean).join(' ');
  return (
    <div className={rootClass} style={style} data-testid="rd-filter-grid">
      {children}
    </div>
  );
}

function FilterGridStack({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={['rd-filter-grid__stack', className].filter(Boolean).join(' ')}>{children}</div>;
}

function FilterGridPeriod({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={['rd-filter-grid__period', className].filter(Boolean).join(' ')}>{children}</div>;
}

function FilterGridFull({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={['rd-filter-grid__full', className].filter(Boolean).join(' ')}>{children}</div>;
}

/** @rosettadash/react/layout/filter-grid — layout.filter-grid */
export const FilterGrid = Object.assign(FilterGridRoot, {
  Stack: FilterGridStack,
  Period: FilterGridPeriod,
  Full: FilterGridFull,
});
