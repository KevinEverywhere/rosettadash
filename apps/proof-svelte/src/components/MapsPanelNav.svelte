<script lang="ts">
  import type { MapsPanelId } from '@rosettadash/core';

  let {
    panel,
    onSelectPanel,
  }: {
    panel: MapsPanelId;
    onSelectPanel?: (panel: MapsPanelId) => void;
  } = $props();

  const panels: Array<{ id: MapsPanelId; label: string; align: 'left' | 'right' }> = [
    { id: 'map', label: 'Map', align: 'left' },
    { id: 'globe', label: 'Globe', align: 'right' },
  ];
</script>

<nav class="da-tabbar da-maps-tabbar" aria-label="Map views">
  {#each panels as entry (entry.id)}
    <button
      type="button"
      class="da-tabbar__tab da-tabbar__tab--{entry.align}"
      aria-current={panel === entry.id ? 'page' : undefined}
      onclick={() => onSelectPanel?.(entry.id)}
    >
      {entry.label}
    </button>
  {/each}
</nav>
