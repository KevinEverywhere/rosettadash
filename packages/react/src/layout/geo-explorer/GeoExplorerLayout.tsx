import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import {
  DestinationSelectList,
  type DestinationSelectItem,
} from '../../visual/destination/destination-select-list/DestinationSelectList.js';

export type GeoExplorerListPlacement = 'left' | 'right';

export interface GeoExplorerLayoutProps {
  title?: string;
  listTitle?: string;
  listPlacement?: GeoExplorerListPlacement;
  listWidth?: string;
  viewportMinHeight?: string;
  items: DestinationSelectItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/layout/geo-explorer — map/globe viewport + destination sidebar list */
export const GeoExplorerLayout = forwardRef<HTMLElement, GeoExplorerLayoutProps>(function GeoExplorerLayout(
  {
    title,
    listTitle,
    listPlacement = 'right',
    listWidth = '14rem',
    viewportMinHeight = '28rem',
    items,
    selectedId,
    onSelect,
    className,
    style,
    children,
  },
  ref,
) {
  const rootClass = ['rd-geo-explorer', className].filter(Boolean).join(' ');
  const bodyClass = [
    'rd-geo-explorer__body',
    listPlacement === 'left' ? 'rd-geo-explorer__body--list-left' : 'rd-geo-explorer__body--list-right',
  ].join(' ');

  const layoutStyle = {
    ...style,
    '--rd-geo-explorer-list-width': listWidth,
    '--rd-geo-explorer-min-height': viewportMinHeight,
  } as CSSProperties;

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={layoutStyle} data-testid="rd-geo-explorer">
      {title ? <span className="rd-geo-explorer__title">{title}</span> : null}
      <div className={bodyClass}>
        <div className="rd-geo-explorer__viewport">{children}</div>
        <DestinationSelectList
          className="rd-geo-explorer__list"
          title={listTitle}
          items={items}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    </section>
  );
});
