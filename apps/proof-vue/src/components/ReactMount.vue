<script setup lang="ts">
import { createElement, type ComponentType } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { onBeforeUnmount, onMounted, ref, toRaw, watchEffect } from 'vue';

const props = defineProps<{
  component: ComponentType<Record<string, unknown>>;
  componentProps?: Record<string, unknown>;
}>();

const host = ref<HTMLDivElement | null>(null);
let root: Root | null = null;

function reactProps() {
  const raw = toRaw(props.componentProps) ?? {};
  // Spread unwraps Vue reactive proxies so function callbacks reach React intact.
  return { ...raw };
}

function renderReact() {
  if (!host.value) {
    return;
  }
  if (!root) {
    root = createRoot(host.value);
  }
  root.render(createElement(props.component, reactProps()));
}

onMounted(renderReact);

watchEffect(() => {
  void props.component;
  const componentProps = props.componentProps;
  if (componentProps) {
    for (const key of Object.keys(componentProps)) {
      void componentProps[key];
    }
  }
  if (host.value) {
    renderReact();
  }
});
onBeforeUnmount(() => {
  root?.unmount();
  root = null;
});
</script>

<template>
  <div ref="host" />
</template>
