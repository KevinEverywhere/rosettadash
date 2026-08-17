<script setup lang="ts">
defineProps<{
  source: string;
  hidden?: boolean;
}>();
</script>

<template>
  <aside
    class="da-workbench__source"
    :class="{ 'da-workbench__pane--hidden-mobile': hidden }"
    aria-label="Component source"
  >
    <header class="da-workbench__source-header">
      <h3>Component source</h3>
      <p>Vue components, props, and nested structure for this screen.</p>
    </header>
    <pre class="da-workbench__code"><code>{{ source }}</code></pre>
  </aside>
</template>

<script lang="ts">
export const ComponentSourcePanel = {};
</script>
