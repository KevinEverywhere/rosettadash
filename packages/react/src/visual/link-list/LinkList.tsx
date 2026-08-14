import { forwardRef, type CSSProperties } from 'react';

/** Single link item for visual/link-list. */
export interface LinkListItem {
  label: string;
  href: string;
  id?: string;
}

/** Public props contract for visual/link-list (parity with web-components). */
export interface LinkListProps {
  items?: LinkListItem[];
  className?: string;
  dense?: boolean;
  /** When set, renders buttons instead of anchors and invokes on selection. */
  onItemSelect?: (item: LinkListItem) => void;
  style?: CSSProperties;
}

export const LinkList = forwardRef<HTMLUListElement, LinkListProps>(function LinkList(
  { items = [], className, dense = false, onItemSelect, style },
  ref,
) {
  const rootClass = [
    'rd-link-list',
    dense ? 'rd-link-list--dense' : '',
    onItemSelect ? 'rd-link-list--selectable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ul ref={ref} className={rootClass} style={style} data-testid="rd-link-list">
      {items.map((item) => (
        <li className="rd-link-list__item" key={`${item.href}:${item.label}`}>
          {onItemSelect ? (
            <button type="button" className="rd-link-list__button" onClick={() => onItemSelect(item)}>
              {item.label}
            </button>
          ) : (
            <a className="rd-link-list__link" href={item.href}>
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
});
