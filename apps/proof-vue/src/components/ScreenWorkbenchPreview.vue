<script setup lang="ts">
defineProps<{
  mobileView: 'preview' | 'source';
}>();
</script>

<template>
  <div
    class="da-workbench__preview"
    :class="{ 'da-workbench__pane--hidden-mobile': mobileView === 'source' }"
  >
    <slot />
  </div>
</template>
