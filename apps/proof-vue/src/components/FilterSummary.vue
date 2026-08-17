<script setup lang="ts">
export interface FilterSummaryChip {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    summaryTitle?: string;
    count?: number;
    countNoun?: string;
    chips?: FilterSummaryChip[];
    hint?: string;
  }>(),
  {
    summaryTitle: 'Filter results',
    count: 0,
    countNoun: 'result',
    chips: () => [],
  },
);

const countLabel = () => (props.count === 1 ? props.countNoun : `${props.countNoun}s`);
</script>

<template>
  <section class="rd-filter-summary" data-testid="rd-filter-summary" aria-live="polite">
    <div class="rd-filter-summary__header">
      <strong>{{ summaryTitle }}</strong>
      <span class="rd-filter-summary__count">{{ count }} {{ countLabel() }}</span>
    </div>
    <dl class="rd-filter-summary__chips">
      <div v-for="chip in chips" :key="chip.label">
        <dt>{{ chip.label }}</dt>
        <dd>{{ chip.value }}</dd>
      </div>
    </dl>
    <p v-if="hint" class="rd-filter-summary__hint">{{ hint }}</p>
  </section>
</template>
