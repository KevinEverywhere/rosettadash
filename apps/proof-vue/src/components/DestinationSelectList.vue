<script setup lang="ts">
export interface DestinationSelectItem {
  id: string;
  label: string;
  meta?: string;
}

defineProps<{
  listTitle?: string;
  items: DestinationSelectItem[];
  selectedId?: string;
}>();

const emit = defineEmits<{ select: [string] }>();
</script>

<template>
  <section class="rd-destination-list" :aria-label="listTitle ?? 'Destinations'">
    <header class="rd-destination-list__header">
      <h3>{{ listTitle ?? 'Destinations' }}</h3>
      <span class="rd-destination-list__count">{{ items.length }}</span>
    </header>
    <ul class="rd-destination-list__items">
      <li
        v-for="item in items"
        :key="item.id"
        class="rd-destination-list__item"
        :class="{ 'rd-destination-list__item--selected': item.id === selectedId }"
      >
        <button
          type="button"
          class="rd-destination-list__button"
          :aria-current="item.id === selectedId ? 'true' : undefined"
          @click="emit('select', item.id)"
        >
          <span class="rd-destination-list__label">{{ item.label }}</span>
          <span v-if="item.meta" class="rd-destination-list__meta">{{ item.meta }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>
