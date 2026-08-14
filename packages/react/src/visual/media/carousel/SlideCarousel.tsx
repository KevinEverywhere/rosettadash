import { forwardRef, useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react';

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
}

export interface SlideCarouselProps {
  title?: string;
  slides?: CarouselSlide[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  autoplayMs?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const FALLBACK_SLIDES: CarouselSlide[] = [
  { id: '1', title: 'Slide A', imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22240%22%3E%3Crect fill=%22%23334155%22 width=%22100%25%22 height=%22100%25%22/%3E%3C/svg%3E' },
  { id: '2', title: 'Slide B', imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22240%22%3E%3Crect fill=%22%231d4ed8%22 width=%22100%25%22 height=%22100%25%22/%3E%3C/svg%3E' },
];

/** @rosettadash/react/visual/media/carousel — thumbnail carousel with prev/next navigation */
export const SlideCarousel = forwardRef<HTMLElement, SlideCarouselProps>(function SlideCarousel(
  { title, slides, selectedId, onSelect, autoplayMs = 0, className, style, children },
  ref,
) {
  const items = slides?.length ? slides : FALLBACK_SLIDES;
  const selectedIndex = Math.max(
    0,
    selectedId ? items.findIndex((slide) => slide.id === selectedId) : 0,
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex >= 0 ? selectedIndex : 0);

  useEffect(() => {
    if (selectedId) {
      const index = items.findIndex((slide) => slide.id === selectedId);
      if (index >= 0) {
        setActiveIndex(index);
      }
    }
  }, [items, selectedId]);

  const goTo = useCallback(
    (index: number) => {
      const wrapped = (index + items.length) % items.length;
      setActiveIndex(wrapped);
      onSelect?.(items[wrapped]?.id ?? '');
    },
    [items, onSelect],
  );

  useEffect(() => {
    if (!autoplayMs || items.length < 2) {
      return;
    }
    const timer = window.setInterval(() => goTo(activeIndex + 1), autoplayMs);
    return () => window.clearInterval(timer);
  }, [activeIndex, autoplayMs, goTo, items.length]);

  const active = items[activeIndex] ?? items[0];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={['rd-media-carousel', className].filter(Boolean).join(' ')}
      style={style}
      data-testid="rd-media-carousel"
      aria-roledescription="carousel"
      aria-label={title ?? 'Media carousel'}
    >
      {title ? <header className="rd-media-carousel__header">{title}</header> : null}
      <div className="rd-media-carousel__viewport">
        <button type="button" className="rd-media-carousel__nav" aria-label="Previous slide" onClick={() => goTo(activeIndex - 1)}>
          ‹
        </button>
        <figure className="rd-media-carousel__slide">
          <img src={active?.imageUrl} alt={active?.title ?? 'Carousel slide'} className="rd-media-carousel__image" />
          <figcaption className="rd-media-carousel__caption">
            <strong>{active?.title}</strong>
            {active?.subtitle ? <span>{active.subtitle}</span> : null}
          </figcaption>
        </figure>
        <button type="button" className="rd-media-carousel__nav" aria-label="Next slide" onClick={() => goTo(activeIndex + 1)}>
          ›
        </button>
      </div>
      <div className="rd-media-carousel__dots" role="tablist" aria-label="Carousel slides">
        {items.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={slide.title}
            className={['rd-media-carousel__dot', index === activeIndex ? 'rd-media-carousel__dot--active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
      {children}
    </section>
  );
});
