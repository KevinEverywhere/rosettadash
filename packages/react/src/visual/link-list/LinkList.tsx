import type { CSSProperties } from 'react';

/** Single link item for visual/link-list. */
export interface LinkListItem {
  label: string;
  href: string;
}

/** Public props contract for visual/link-list (parity with web-components). */
export interface LinkListProps {
  items?: LinkListItem[];
  className?: string;
  dense?: boolean;
  style?: CSSProperties;
}

export function LinkList({
  items = [],
  className,
  dense = false,
  style,
}: LinkListProps) {
  const rootClass = [
    'rd-link-list',
    dense ? 'rd-link-list--dense' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ul className={rootClass} style={style} data-testid="rd-link-list">
      {items.map((item) => (
        <li
          className="rd-link-list__item"
          key={`${item.href}:${item.label}`}
        >
          <a className="rd-link-list__link" href={item.href}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
