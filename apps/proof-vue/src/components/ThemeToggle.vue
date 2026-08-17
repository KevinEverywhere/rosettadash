<script setup lang="ts">
import type { ThemePreference } from '../composables/use-theme-preference';

defineProps<{
  theme: ThemePreference;
  class?: string;
}>();

const emit = defineEmits<{
  change: [ThemePreference];
}>();
</script>

<template>
  <label :class="['da-theme-toggle', $props.class].filter(Boolean)">
    <span>Theme</span>
    <select
      :value="theme"
      aria-label="Color theme"
      @change="emit('change', ($event.target as HTMLSelectElement).value as ThemePreference)"
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
</template>
