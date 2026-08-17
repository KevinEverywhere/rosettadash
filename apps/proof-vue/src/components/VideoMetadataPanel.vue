<script setup lang="ts">
export interface VideoMetadataItem {
  label: string;
  value: string;
}

withDefaults(
  defineProps<{
    panelTitle?: string;
    items?: VideoMetadataItem[];
  }>(),
  {
    panelTitle: 'Video characteristics',
    items: () => [],
  },
);
</script>

<template>
  <section class="rd-video-metadata" data-testid="rd-video-metadata">
    <h3 class="rd-video-metadata__title">{{ panelTitle }}</h3>
    <dl class="rd-video-metadata__list">
      <div v-for="item in items" :key="item.label">
        <dt>{{ item.label }}</dt>
        <dd>{{ item.value }}</dd>
      </div>
    </dl>
  </section>
</template>
