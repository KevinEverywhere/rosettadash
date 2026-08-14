<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DateRangeFilterProps } from './types';

	type Props = DateRangeFilterProps & { children?: Snippet };

	let {
		className,
		label,
		startDate,
		endDate,
		presetLabel,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-input-date-range', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-input-date-range">
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	<div class="rd-date-range__controls">
		<input type="date" class="rd-input" value={startDate ?? ''} />
		<span class="rd-date-range__sep">to</span>
		<input type="date" class="rd-input" value={endDate ?? ''} />
	</div>
	{#if presetLabel}<span class="rd-date-range__preset">{presetLabel}</span>{/if}
	{@render children?.()}
</section>
