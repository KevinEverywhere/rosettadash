<script lang="ts">
  let {
    title,
    fullWidth = false,
    columns = 1,
    children,
  }: {
    title?: string;
    fullWidth?: boolean;
    columns?: 1 | 2;
    children?: import('svelte').Snippet;
  } = $props();
</script>

<section class="rd-form-section" class:rd-form-section--full={fullWidth} data-testid="rd-form-section">
  {#if title}<h3 class="rd-form-section__title">{title}</h3>{/if}
  <div class="rd-form-section__body" class:rd-form-section__body--2col={columns === 2}>
    {@render children?.()}
  </div>
</section>
