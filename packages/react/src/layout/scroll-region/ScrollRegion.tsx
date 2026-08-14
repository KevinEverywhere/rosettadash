import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface ScrollRegionProps {
  title?: string;
  /** When set, constrains height and enables vertical scroll when content overflows. */
  maxHeight?: string;
  /** Show scrollbar only while scrolling / when overflow exists (default true). */
  overlayScrollbar?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/layout/scroll-region — designated scroll container for long-form content */
export const ScrollRegion = forwardRef<HTMLElement, ScrollRegionProps>(function ScrollRegion(
  { title, maxHeight, overlayScrollbar = true, className, style, children },
  ref,
) {
  const rootClass = [
    'rd-scroll-region',
    overlayScrollbar ? 'rd-scroll-region--overlay-scrollbar' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const regionStyle: CSSProperties = {
    ...style,
    ...(maxHeight ? { maxHeight } : {}),
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={rootClass}
      style={regionStyle}
      data-testid="rd-scroll-region"
      aria-label={title ?? 'Scrollable content'}
    >
      {title ? <header className="rd-scroll-region__header">{title}</header> : null}
      <div className="rd-scroll-region__body">{children}</div>
    </section>
  );
});
