<script setup lang="ts">
import DestinationSelectList, { type DestinationSelectItem } from './DestinationSelectList.vue';

export type GeoExplorerListPlacement = 'left' | 'right';

defineProps<{
  explorerTitle?: string;
  sidebarTitle?: string;
  listPlacement?: GeoExplorerListPlacement;
  listWidth?: string;
  viewportMinHeight?: string;
  items: DestinationSelectItem[];
  selectedId?: string;
}>();

const emit = defineEmits<{ select: [string] }>();
</script>

<template>
  <section
    class="rd-geo-explorer"
    data-testid="rd-geo-explorer"
    :style="{
      '--rd-geo-explorer-list-width': listWidth ?? '14rem',
      '--rd-geo-explorer-min-height': viewportMinHeight ?? '28rem',
    }"
  >
    <span v-if="explorerTitle" class="rd-geo-explorer__title">{{ explorerTitle }}</span>
    <div
      class="rd-geo-explorer__body"
      :class="{
        'rd-geo-explorer__body--list-left': (listPlacement ?? 'right') === 'left',
        'rd-geo-explorer__body--list-right': (listPlacement ?? 'right') === 'right',
      }"
    >
      <div class="rd-geo-explorer__viewport">
        <slot />
      </div>
      <DestinationSelectList
        class="rd-geo-explorer__list"
        :list-title="sidebarTitle ?? 'Destinations'"
        :items="items"
        :selected-id="selectedId"
        @select="emit('select', $event)"
      />
    </div>
  </section>
</template>
