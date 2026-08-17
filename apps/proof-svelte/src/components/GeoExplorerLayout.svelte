<script lang="ts">
  import DestinationSelectList, { type DestinationSelectItem } from './DestinationSelectList.svelte';
  import type { Snippet } from 'svelte';

  export type GeoExplorerListPlacement = 'left' | 'right';

  let {
    explorerTitle,
    sidebarTitle = 'Destinations',
    listPlacement = 'right',
    listWidth = '14rem',
    viewportMinHeight = '28rem',
    items,
    selectedId,
    onSelect,
    children,
  }: {
    explorerTitle?: string;
    sidebarTitle?: string;
    listPlacement?: GeoExplorerListPlacement;
    listWidth?: string;
    viewportMinHeight?: string;
    items: DestinationSelectItem[];
    selectedId?: string;
    onSelect?: (id: string) => void;
    children?: Snippet;
  } = $props();
</script>

<section
  class="rd-geo-explorer"
  data-testid="rd-geo-explorer"
  style={`--rd-geo-explorer-list-width: ${listWidth}; --rd-geo-explorer-min-height: ${viewportMinHeight};`}
>
  {#if explorerTitle}<span class="rd-geo-explorer__title">{explorerTitle}</span>{/if}
  <div
    class="rd-geo-explorer__body"
    class:rd-geo-explorer__body--list-left={listPlacement === 'left'}
    class:rd-geo-explorer__body--list-right={listPlacement === 'right'}
  >
    <div class="rd-geo-explorer__viewport">
      {@render children?.()}
    </div>
    <div class="rd-geo-explorer__list">
      <DestinationSelectList listTitle={sidebarTitle} {items} {selectedId} {onSelect} />
    </div>
  </div>
</section>
