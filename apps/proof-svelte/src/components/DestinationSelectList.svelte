<script lang="ts">
  export interface DestinationSelectItem {
    id: string;
    label: string;
    meta?: string;
  }

  let {
    listTitle = 'Destinations',
    items,
    selectedId,
    onSelect,
  }: {
    listTitle?: string;
    items: DestinationSelectItem[];
    selectedId?: string;
    onSelect?: (id: string) => void;
  } = $props();
</script>

<section class="rd-destination-list" aria-label={listTitle}>
  <header class="rd-destination-list__header">
    <h3>{listTitle}</h3>
    <span class="rd-destination-list__count">{items.length}</span>
  </header>
  <ul class="rd-destination-list__items">
    {#each items as item (item.id)}
      <li
        class="rd-destination-list__item"
        class:rd-destination-list__item--selected={item.id === selectedId}
      >
        <button
          type="button"
          class="rd-destination-list__button"
          aria-current={item.id === selectedId ? 'true' : undefined}
          onclick={() => onSelect?.(item.id)}
        >
          <span class="rd-destination-list__label">{item.label}</span>
          {#if item.meta}<span class="rd-destination-list__meta">{item.meta}</span>{/if}
        </button>
      </li>
    {/each}
  </ul>
</section>
