<script lang="ts">
  let {
    mobileView,
    onChange,
  }: {
    mobileView: 'preview' | 'source';
    onChange?: (view: 'preview' | 'source') => void;
  } = $props();
</script>

<div class="da-workbench__mobile-toggle" role="tablist" aria-label="Preview or source">
  <button
    type="button"
    role="tab"
    aria-selected={mobileView === 'preview'}
    class:is-active={mobileView === 'preview'}
    onclick={() => onChange?.('preview')}
  >
    Atlas preview
  </button>
  <button
    type="button"
    role="tab"
    aria-selected={mobileView === 'source'}
    class:is-active={mobileView === 'source'}
    onclick={() => onChange?.('source')}
  >
    Component source
  </button>
</div>
