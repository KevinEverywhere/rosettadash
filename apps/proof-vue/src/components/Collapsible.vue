<script setup lang="ts">
const props = defineProps<{
  panelTitle?: string;
  panelSummary?: string;
  open?: boolean;
}>();

const emit = defineEmits<{ openChange: [boolean] }>();

function toggle() {
  emit('openChange', !props.open);
}
</script>

<template>
  <section class="rd-collapsible" :class="{ 'is-open': open }">
    <button type="button" class="rd-collapsible__header" :aria-expanded="open ?? false" @click="toggle">
      <span class="rd-collapsible__titles">
        <span class="rd-collapsible__title">{{ panelTitle ?? 'Section' }}</span>
        <span v-if="panelSummary" class="rd-collapsible__summary">{{ panelSummary }}</span>
      </span>
      <span class="rd-collapsible__chevron" aria-hidden="true">{{ open ? '▾' : '▸' }}</span>
    </button>
    <div v-if="open" class="rd-collapsible__panel">
      <slot />
    </div>
  </section>
</template>
