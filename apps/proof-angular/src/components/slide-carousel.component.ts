import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
}

@Component({
  selector: 'da-slide-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="rd-media-carousel"
      data-testid="rd-media-carousel"
      aria-roledescription="carousel"
      [attr.aria-label]="carouselTitle()"
    >
      @if (carouselTitle()) {
        <header class="rd-media-carousel__header">{{ carouselTitle() }}</header>
      }
      <div class="rd-media-carousel__viewport">
        <button type="button" class="rd-media-carousel__nav" aria-label="Previous slide" (click)="goTo(activeIndex() - 1)">
          ‹
        </button>
        <figure class="rd-media-carousel__slide">
          <img [src]="activeSlide()?.imageUrl" [alt]="activeSlide()?.title ?? 'Carousel slide'" class="rd-media-carousel__image" />
          <figcaption class="rd-media-carousel__caption">
            <strong>{{ activeSlide()?.title }}</strong>
            @if (activeSlide()?.subtitle) {
              <span>{{ activeSlide()?.subtitle }}</span>
            }
          </figcaption>
        </figure>
        <button type="button" class="rd-media-carousel__nav" aria-label="Next slide" (click)="goTo(activeIndex() + 1)">
          ›
        </button>
      </div>
      <div class="rd-media-carousel__dots" role="tablist" aria-label="Carousel slides">
        @for (slide of slides(); track slide.id; let index = $index) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="index === activeIndex()"
            [attr.aria-label]="slide.title"
            class="rd-media-carousel__dot"
            [class.rd-media-carousel__dot--active]="index === activeIndex()"
            (click)="goTo(index)"
          ></button>
        }
      </div>
    </section>
  `,
})
export class SlideCarouselComponent {
  readonly carouselTitle = input<string | undefined>(undefined, { alias: 'title' });
  readonly slides = input<CarouselSlide[]>([]);
  readonly selectedId = input<string | undefined>(undefined);

  readonly select = output<string>();

  readonly activeIndex = signal(0);

  constructor() {
    effect(() => {
      const selectedId = this.selectedId();
      const items = this.slides();
      if (!selectedId) {
        return;
      }
      const index = items.findIndex((slide) => slide.id === selectedId);
      if (index >= 0) {
        this.activeIndex.set(index);
      }
    });
  }

  activeSlide(): CarouselSlide | undefined {
    return this.slides()[this.activeIndex()] ?? this.slides()[0];
  }

  goTo(index: number): void {
    const items = this.slides();
    if (!items.length) {
      return;
    }
    const wrapped = (index + items.length) % items.length;
    this.activeIndex.set(wrapped);
    this.select.emit(items[wrapped]?.id ?? '');
  }
}
