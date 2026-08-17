<script setup lang="ts">
import { computed, ref, watch } from 'vue';

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
}

const props = defineProps<{
  title?: string;
  slides?: CarouselSlide[];
  selectedId?: string;
}>();

const emit = defineEmits<{ select: [string] }>();

const activeIndex = ref(0);

watch(
  () => [props.selectedId, props.slides] as const,
  ([selectedId, slides]) => {
    if (!selectedId || !slides?.length) return;
    const index = slides.findIndex((slide) => slide.id === selectedId);
    if (index >= 0) activeIndex.value = index;
  },
  { immediate: true },
);

const activeSlide = computed(() => props.slides?.[activeIndex.value] ?? props.slides?.[0]);

function goTo(index: number) {
  const items = props.slides ?? [];
  if (!items.length) return;
  const wrapped = (index + items.length) % items.length;
  activeIndex.value = wrapped;
  emit('select', items[wrapped]?.id ?? '');
}
</script>

<template>
  <section
    class="rd-media-carousel"
    data-testid="rd-media-carousel"
    aria-roledescription="carousel"
    :aria-label="title ?? 'Carousel'"
  >
    <header v-if="title" class="rd-media-carousel__header">{{ title }}</header>
    <div class="rd-media-carousel__viewport">
      <button type="button" class="rd-media-carousel__nav" aria-label="Previous slide" @click="goTo(activeIndex - 1)">
        ‹
      </button>
      <figure class="rd-media-carousel__slide">
        <img
          :src="activeSlide?.imageUrl"
          :alt="activeSlide?.title ?? 'Carousel slide'"
          class="rd-media-carousel__image"
        />
        <figcaption class="rd-media-carousel__caption">
          <strong>{{ activeSlide?.title }}</strong>
          <span v-if="activeSlide?.subtitle">{{ activeSlide.subtitle }}</span>
        </figcaption>
      </figure>
      <button type="button" class="rd-media-carousel__nav" aria-label="Next slide" @click="goTo(activeIndex + 1)">
        ›
      </button>
    </div>
    <div class="rd-media-carousel__dots" role="tablist" aria-label="Carousel slides">
      <button
        v-for="(slide, index) in slides ?? []"
        :key="slide.id"
        type="button"
        role="tab"
        :aria-selected="index === activeIndex"
        :aria-label="slide.title"
        class="rd-media-carousel__dot"
        :class="{ 'rd-media-carousel__dot--active': index === activeIndex }"
        @click="goTo(index)"
      />
    </div>
  </section>
</template>
