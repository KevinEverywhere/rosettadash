<script lang="ts">
  let {
    panelTitle = 'Section',
    panelSummary,
    open = false,
    class: className,
    onOpenChange,
    children,
  }: {
    panelTitle?: string;
    panelSummary?: string;
    open?: boolean;
    class?: string;
    onOpenChange?: (open: boolean) => void;
    children?: import('svelte').Snippet;
  } = $props();

  function toggle() {
    onOpenChange?.(!open);
  }
</script>

<section class={['rd-collapsible', className].filter(Boolean).join(' ')} class:is-open={open}>
  <button type="button" class="rd-collapsible__header" aria-expanded={open} onclick={toggle}>
    <span class="rd-collapsible__titles">
      <span class="rd-collapsible__title">{panelTitle}</span>
      {#if panelSummary}<span class="rd-collapsible__summary">{panelSummary}</span>{/if}
    </span>
    <span class="rd-collapsible__chevron" aria-hidden="true">{open ? '▾' : '▸'}</span>
  </button>
  {#if open}
    <div class="rd-collapsible__panel">
      {@render children?.()}
    </div>
  {/if}
</section>
