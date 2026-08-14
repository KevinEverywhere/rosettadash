<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { KpiCardProps } from './types';

	type Props = KpiCardProps & { children?: Snippet };

	let {
		className,
		title,
		value,
		delta,
		format,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-kpi', className].filter(Boolean).join(' '));
</script>

<article class={rootClass} data-testid="rd-kpi">
	<span class="rd-kpi__title">{title ?? 'Metric'}</span>
	<span class="rd-kpi__value">{value ?? '—'}</span>
	{#if delta}<span class="rd-kpi__delta">{delta}</span>{/if}
	{@render children?.()}
</article>
