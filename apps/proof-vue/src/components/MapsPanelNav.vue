<script setup lang="ts">
import type { MapsPanelId } from '@rosettadash/core';

defineProps<{ panel: MapsPanelId }>();
const emit = defineEmits<{ selectPanel: [MapsPanelId] }>();

const panels: Array<{ id: MapsPanelId; label: string; align: 'left' | 'right' }> = [
  { id: 'map', label: 'Map', align: 'left' },
  { id: 'globe', label: 'Globe', align: 'right' },
];
</script>

<template>
  <nav class="da-tabbar da-maps-tabbar" aria-label="Map views">
    <button
      v-for="entry in panels"
      :key="entry.id"
      type="button"
      :class="['da-tabbar__tab', `da-tabbar__tab--${entry.align}`]"
      :aria-current="panel === entry.id ? 'page' : undefined"
      @click="emit('selectPanel', entry.id)"
    >
      {{ entry.label }}
    </button>
  </nav>
</template>
