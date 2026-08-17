<script setup lang="ts">
export interface VennSet {
  id: string;
  label: string;
  count: number;
  color?: string;
}

export interface VennOverlap {
  setIds: string[];
  count: number;
  label?: string;
}

const DEFAULT_COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

const props = defineProps<{
  title?: string;
  sets?: VennSet[];
  overlaps?: VennOverlap[];
}>();

function threeWay() {
  return (props.sets ?? []).length >= 3;
}

function colorAt(index: number) {
  const set = props.sets?.[index];
  return set?.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}
</script>

<template>
  <section class="rd-chart-venn" data-testid="rd-chart-venn" role="img" :aria-label="title ?? 'Overlap diagram'">
    <header class="rd-chart-venn__header">
      <span>{{ title ?? 'Overlap diagram' }}</span>
    </header>
    <div class="rd-chart-venn__body">
      <svg viewBox="0 0 420 260" class="rd-chart-venn__svg" aria-hidden="true">
        <template v-if="threeWay()">
          <circle cx="150" cy="120" r="72" class="rd-chart-venn__circle" :fill="colorAt(0)" />
          <circle cx="270" cy="120" r="72" class="rd-chart-venn__circle" :fill="colorAt(1)" />
          <circle cx="210" cy="170" r="72" class="rd-chart-venn__circle" :fill="colorAt(2)" />
          <text x="95" y="75" class="rd-chart-venn__set-label">{{ sets?.[0]?.label }}</text>
          <text x="300" y="75" class="rd-chart-venn__set-label">{{ sets?.[1]?.label }}</text>
          <text x="210" y="230" class="rd-chart-venn__set-label" text-anchor="middle">{{ sets?.[2]?.label }}</text>
        </template>
        <template v-else>
          <circle cx="155" cy="130" r="78" class="rd-chart-venn__circle" :fill="colorAt(0)" />
          <circle cx="265" cy="130" r="78" class="rd-chart-venn__circle" :fill="colorAt(1)" />
          <text x="105" y="130" class="rd-chart-venn__set-label">{{ sets?.[0]?.label }}</text>
          <text x="315" y="130" class="rd-chart-venn__set-label" text-anchor="end">{{ sets?.[1]?.label }}</text>
        </template>
      </svg>
      <ul class="rd-chart-venn__legend">
        <li v-for="(set, index) in sets ?? []" :key="set.id">
          <span class="rd-chart-venn__swatch" :style="{ background: set.color ?? colorAt(index) }" />
          <span>{{ set.label }}</span>
          <strong>{{ set.count.toLocaleString() }}</strong>
        </li>
        <li v-for="overlap in overlaps ?? []" :key="overlap.setIds.join('-')">
          <span class="rd-chart-venn__swatch rd-chart-venn__swatch--overlap" />
          <span>{{ overlap.label ?? overlap.setIds.join(' ∩ ') }}</span>
          <strong>{{ overlap.count.toLocaleString() }}</strong>
        </li>
      </ul>
    </div>
  </section>
</template>
