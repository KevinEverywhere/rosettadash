<script lang="ts">
  let {
    source,
    hidden = false,
  }: {
    source: string;
    hidden?: boolean;
  } = $props();
</script>

<aside
  class="da-workbench__source"
  class:da-workbench__pane--hidden-mobile={hidden}
  aria-label="Component source"
>
  <header class="da-workbench__source-header">
    <h3>Component source</h3>
    <p>Svelte components, props, and nested structure for this screen.</p>
  </header>
  <pre class="da-workbench__code"><code>{source}</code></pre>
</aside>
