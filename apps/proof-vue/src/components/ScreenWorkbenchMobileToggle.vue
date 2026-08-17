<script setup lang="ts">
defineProps<{
  mobileView: 'preview' | 'source';
}>();

const emit = defineEmits<{
  change: ['preview' | 'source'];
}>();
</script>

<template>
  <div class="da-workbench__mobile-toggle" role="tablist" aria-label="Preview or source">
    <button
      type="button"
      role="tab"
      :aria-selected="mobileView === 'preview'"
      :class="{ 'is-active': mobileView === 'preview' }"
      @click="emit('change', 'preview')"
    >
      Atlas preview
    </button>
    <button
      type="button"
      role="tab"
      :aria-selected="mobileView === 'source'"
      :class="{ 'is-active': mobileView === 'source' }"
      @click="emit('change', 'source')"
    >
      Component source
    </button>
  </div>
</template>
