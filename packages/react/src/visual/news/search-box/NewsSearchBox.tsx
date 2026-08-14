import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface NewsSearchBoxProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/news/search-box — visual.news.search-box */
export const NewsSearchBox = forwardRef<HTMLElement, NewsSearchBoxProps>(function NewsSearchBox(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-news-search-box', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-news-search-box">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <div className="rd-search__row">
        <input type="search" className="rd-input" placeholder={props.placeholder ?? 'Search news…'} value={props.value} onChange={(e) => props.onSearch?.(e.target.value)} />
        <button type="button" className="rd-button">Search</button>
      </div>
      {children}
    </section>
  );
});
