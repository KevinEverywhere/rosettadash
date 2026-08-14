import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface DataTableRow {
  id: string;
  name?: string;
  status?: string;
  amount?: number;
  date?: string;
  [key: string]: string | number | undefined;
}

export interface DataTableProps {
  title?: string;
  rows?: DataTableRow[];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/table — visual.table */
export const DataTable = forwardRef<HTMLElement, DataTableProps>(function DataTable(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-table', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-table">
      <header className="rd-table__header"><span>{props.title ?? 'Data table'}</span></header>
      <table className="rd-table__table">
        <thead><tr><th>Name</th><th>Status</th><th>Amount</th><th>Date</th></tr></thead>
        <tbody>
          {(props.rows ?? []).map((row) => (
            <tr key={row.id}><td>{row.name}</td><td>{row.status}</td><td>{row.amount}</td><td>{row.date}</td></tr>
          ))}
        </tbody>
      </table>
      {children}
    </section>
  );
});
