<script lang="ts">
  let { children }: { children?: import('svelte').Snippet } = $props();
</script>

<div class="rd-form-section-grid" data-testid="rd-form-section-grid">
  {@render children?.()}
</div>
