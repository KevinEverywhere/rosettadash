import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface NewsResultsRow {
  id: string;
  [key: string]: string | number | undefined;
}

export interface NewsResultsColumn {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  format?: (value: unknown, row: NewsResultsRow) => string;
}

export interface NewsResultsTableProps {
  title?: string;
  rows?: NewsResultsRow[];
  columns?: NewsResultsColumn[];
  selectedRowId?: string;
  onRowSelect?: (rowId: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const DEFAULT_COLUMNS: NewsResultsColumn[] = [
  { key: 'headline', header: 'Headline' },
  { key: 'source', header: 'Source' },
  { key: 'region', header: 'Region' },
  { key: 'published', header: 'Published' },
];

function cellValue(row: NewsResultsRow, column: NewsResultsColumn): string {
  const raw = row[column.key];
  if (column.format) {
    return column.format(raw, row);
  }
  if (raw === undefined || raw === null) {
    return '—';
  }
  return String(raw);
}

/** @rosettadash/react/visual/news/results-table — visual.news.results-table */
export const NewsResultsTable = forwardRef<HTMLElement, NewsResultsTableProps>(function NewsResultsTable(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-news-results-table', 'rd-table', className].filter(Boolean).join(' ');
  const columns = props.columns?.length ? props.columns : DEFAULT_COLUMNS;
  const rows = props.rows ?? [];

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-news-results-table">
      <header className="rd-table__header">
        <span>{props.title ?? 'News results'}</span>
        {rows.length ? <span className="rd-table__count">{rows.length} articles</span> : null}
      </header>
      <div className="rd-table__scroll">
        <table className="rd-table__table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.align ? `rd-table__cell--${column.align}` : undefined}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const selected = props.selectedRowId === row.id;
              return (
                <tr
                  key={row.id}
                  className={[
                    'rd-table__row',
                    selected ? 'rd-table__row--selected' : '',
                    props.onRowSelect ? 'rd-table__row--interactive' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-selected={selected || undefined}
                  onClick={props.onRowSelect ? () => props.onRowSelect?.(row.id) : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={column.align ? `rd-table__cell--${column.align}` : undefined}
                    >
                      {cellValue(row, column)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {children}
    </section>
  );
});
