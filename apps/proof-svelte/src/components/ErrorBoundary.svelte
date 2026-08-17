<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    label,
    children,
  }: {
    label: string;
    children?: Snippet;
  } = $props();
</script>

<svelte:boundary>
  {@render children?.()}
  {#snippet failed(error)}
    <section class="da-panel da-error-panel" role="alert">
      <h2>Something went wrong</h2>
      <p>
        The <strong>{label}</strong> screen hit an error. Other tabs should still work.
      </p>
      <pre class="da-error-panel__trace">{error instanceof Error ? error.message : String(error)}</pre>
    </section>
  {/snippet}
</svelte:boundary>
