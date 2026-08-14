import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface NewsTypeSelectProps {
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/visual/news/type-select — visual.news.type-select */
export const NewsTypeSelect = forwardRef<HTMLElement, NewsTypeSelectProps>(function NewsTypeSelect(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-news-type-select', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-news-type-select">
      {props.label ? <span className="rd-field__label">{props.label}</span> : null}
      <select className="rd-select" value={props.value} onChange={(e) => props.onChange?.(e.target.value)}>
        <option value="">{props.placeholder ?? 'Select…'}</option>
        {(props.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {children}
    </section>
  );
});
