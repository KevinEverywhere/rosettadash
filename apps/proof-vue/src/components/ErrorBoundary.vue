<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorBoundary',
  props: {
    label: { type: String, required: true },
  },
  data() {
    return { error: null as Error | null };
  },
  errorCaptured(err: unknown) {
    this.error = err instanceof Error ? err : new Error(String(err));
    console.error(`[${this.label}]`, err);
    return false;
  },
});
</script>

<template>
  <section v-if="error" class="da-panel da-error-panel" role="alert">
    <h2>Something went wrong</h2>
    <p>
      The <strong>{{ label }}</strong> screen hit an error. Other tabs should still work.
    </p>
    <pre class="da-error-panel__trace">{{ error.message }}</pre>
  </section>
  <slot v-else />
</template>
