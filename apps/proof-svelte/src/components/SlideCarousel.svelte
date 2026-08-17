<script lang="ts">
  export interface CarouselSlide {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
  }

  let {
    title,
    slides = [],
    selectedId,
    onSelect,
  }: {
    title?: string;
    slides?: CarouselSlide[];
    selectedId?: string;
    onSelect?: (id: string) => void;
  } = $props();

  let activeIndex = $state(0);

  $effect(() => {
    if (!selectedId || !slides.length) {
      return;
    }
    const index = slides.findIndex((slide) => slide.id === selectedId);
    if (index >= 0) {
      activeIndex = index;
    }
  });

  const activeSlide = $derived(slides[activeIndex] ?? slides[0]);

  function goTo(index: number) {
    if (!slides.length) {
      return;
    }
    const wrapped = (index + slides.length) % slides.length;
    activeIndex = wrapped;
    onSelect?.(slides[wrapped]?.id ?? '');
  }
</script>

<section
  class="rd-media-carousel"
  data-testid="rd-media-carousel"
  aria-roledescription="carousel"
  aria-label={title ?? 'Carousel'}
>
  {#if title}<header class="rd-media-carousel__header">{title}</header>{/if}
  <div class="rd-media-carousel__viewport">
    <button type="button" class="rd-media-carousel__nav" aria-label="Previous slide" onclick={() => goTo(activeIndex - 1)}>
      ‹
    </button>
    <figure class="rd-media-carousel__slide">
      <img
        src={activeSlide?.imageUrl}
        alt={activeSlide?.title ?? 'Carousel slide'}
        class="rd-media-carousel__image"
      />
      <figcaption class="rd-media-carousel__caption">
        <strong>{activeSlide?.title}</strong>
        {#if activeSlide?.subtitle}<span>{activeSlide.subtitle}</span>{/if}
      </figcaption>
    </figure>
    <button type="button" class="rd-media-carousel__nav" aria-label="Next slide" onclick={() => goTo(activeIndex + 1)}>
      ›
    </button>
  </div>
  <div class="rd-media-carousel__dots" role="tablist" aria-label="Carousel slides">
    {#each slides as slide, index (slide.id)}
      <button
        type="button"
        role="tab"
        aria-selected={index === activeIndex}
        aria-label={slide.title}
        class="rd-media-carousel__dot"
        class:rd-media-carousel__dot--active={index === activeIndex}
        onclick={() => goTo(index)}
      ></button>
    {/each}
  </div>
</section>
