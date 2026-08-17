<script lang="ts">
  let {
    mobileView,
    children,
  }: {
    mobileView: 'preview' | 'source';
    children?: import('svelte').Snippet;
  } = $props();
</script>

<div
  class="da-workbench__preview"
  class:da-workbench__pane--hidden-mobile={mobileView === 'source'}
>
  {@render children?.()}
</div>
