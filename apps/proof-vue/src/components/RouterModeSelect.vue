<script setup lang="ts">
import { CLIENT_ROUTER_MODE_OPTIONS, type ClientRouterMode } from '@rosettadash/core';

defineProps<{
  mode: ClientRouterMode;
}>();

const emit = defineEmits<{
  change: [ClientRouterMode];
}>();
</script>

<template>
  <label class="da-router-mode">
    <span>Router</span>
    <select
      :value="mode"
      aria-label="Client router mode"
      @change="emit('change', ($event.target as HTMLSelectElement).value as ClientRouterMode)"
    >
      <option v-for="option in CLIENT_ROUTER_MODE_OPTIONS" :key="option.id" :value="option.id">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
