import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface NewsArticleDetailProps {
  title?: string;
  emptyMessage?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/news/article-detail — visual.news.article-detail */
export const NewsArticleDetail = forwardRef<HTMLElement, NewsArticleDetailProps>(function NewsArticleDetail(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-news-article-detail', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-news-article-detail">
      <header className="rd-detail__header"><span>{props.title ?? 'Article'}</span></header>
      <p className="rd-detail__empty">{props.emptyMessage ?? 'Select a headline in News Results'}</p>
      {children}
    </section>
  );
});
