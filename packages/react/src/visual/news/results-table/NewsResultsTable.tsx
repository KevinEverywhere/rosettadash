import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface NewsResultsTableProps {
  title?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/news/results-table — visual.news.results-table */
export const NewsResultsTable = forwardRef<HTMLElement, NewsResultsTableProps>(function NewsResultsTable(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-news-results-table', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-news-results-table">
      <header className="rd-table__header"><span>{props.title ?? 'News results'}</span></header>
      <table className="rd-table"><thead><tr><th>Headline</th><th>Source</th><th>Region</th><th>Published</th></tr></thead><tbody /></table>
      {children}
    </section>
  );
});
