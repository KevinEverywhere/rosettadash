import { forwardRef, type CSSProperties } from 'react';

export interface DestinationSelectItem {
  id: string;
  label: string;
  meta?: string;
}

export interface DestinationSelectListProps {
  title?: string;
  items: DestinationSelectItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  style?: CSSProperties;
}

/** @rosettadash/react/visual/destination/destination-select-list — selectable destination sidebar list */
export const DestinationSelectList = forwardRef<HTMLElement, DestinationSelectListProps>(
  function DestinationSelectList({ title = 'Destinations', items, selectedId, onSelect, className, style }, ref) {
    const rootClass = ['rd-destination-list', className].filter(Boolean).join(' ');

    return (
      <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} aria-label={title}>
        <header className="rd-destination-list__header">
          <h3>{title}</h3>
          <span className="rd-destination-list__count">{items.length}</span>
        </header>
        <ul className="rd-destination-list__items">
          {items.map((item) => {
            const selected = item.id === selectedId;
            return (
              <li
                key={item.id}
                className={['rd-destination-list__item', selected ? 'rd-destination-list__item--selected' : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <button
                  type="button"
                  className="rd-destination-list__button"
                  aria-current={selected ? 'true' : undefined}
                  onClick={() => onSelect?.(item.id)}
                >
                  <span className="rd-destination-list__label">{item.label}</span>
                  {item.meta ? <span className="rd-destination-list__meta">{item.meta}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  },
);
