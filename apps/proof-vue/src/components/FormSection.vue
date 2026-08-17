<script setup lang="ts">
defineProps<{ title?: string; fullWidth?: boolean; columns?: 1 | 2 }>();
</script>

<template>
  <section
    class="rd-form-section"
    :class="{ 'rd-form-section--full': fullWidth }"
    data-testid="rd-form-section"
  >
    <h3 v-if="title" class="rd-form-section__title">{{ title }}</h3>
    <div class="rd-form-section__body" :class="{ 'rd-form-section__body--2col': columns === 2 }">
      <slot />
    </div>
  </section>
</template>
