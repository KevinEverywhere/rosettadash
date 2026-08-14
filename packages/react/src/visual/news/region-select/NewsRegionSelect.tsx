import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface NewsRegionSelectProps {
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/news/region-select — visual.news.region-select */
export const NewsRegionSelect = forwardRef<HTMLElement, NewsRegionSelectProps>(function NewsRegionSelect(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-news-region-select', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-news-region-select">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <select className="rd-select" value={props.value} onChange={(e) => props.onChange?.(e.target.value)}>
        <option value="">{props.placeholder ?? 'Select…'}</option>
        {(props.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {children}
    </section>
  );
});
