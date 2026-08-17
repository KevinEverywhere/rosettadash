<script setup lang="ts">
import { createElement, type ComponentType } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  component: ComponentType<Record<string, unknown>>;
  componentProps?: Record<string, unknown>;
}>();

const host = ref<HTMLDivElement | null>(null);
let root: Root | null = null;

function renderReact() {
  if (!host.value) {
    return;
  }
  if (!root) {
    root = createRoot(host.value);
  }
  root.render(createElement(props.component, props.componentProps ?? {}));
}

onMounted(renderReact);
watch(() => props.componentProps, renderReact, { deep: true });
onBeforeUnmount(() => {
  root?.unmount();
  root = null;
});
</script>

<template>
  <div ref="host" />
</template>
