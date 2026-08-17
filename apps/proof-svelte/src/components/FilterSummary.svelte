<script lang="ts">
  export interface FilterSummaryChip {
    label: string;
    value: string;
  }

  let {
    summaryTitle = 'Filter results',
    count = 0,
    countNoun = 'result',
    chips = [],
    hint,
  }: {
    summaryTitle?: string;
    count?: number;
    countNoun?: string;
    chips?: FilterSummaryChip[];
    hint?: string;
  } = $props();

  const countLabel = $derived(count === 1 ? countNoun : `${countNoun}s`);
</script>

<section class="rd-filter-summary" data-testid="rd-filter-summary" aria-live="polite">
  <div class="rd-filter-summary__header">
    <strong>{summaryTitle}</strong>
    <span class="rd-filter-summary__count">{count} {countLabel}</span>
  </div>
  <dl class="rd-filter-summary__chips">
    {#each chips as chip (chip.label)}
      <div>
        <dt>{chip.label}</dt>
        <dd>{chip.value}</dd>
      </div>
    {/each}
  </dl>
  {#if hint}<p class="rd-filter-summary__hint">{hint}</p>{/if}
</section>
