<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PieChartProps } from './types';

	type Props = PieChartProps & { children?: Snippet };

	let {
		className,
		title,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-chart-pie', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-chart-pie">
	<header class="rd-chart-pie__header"><span>{title ?? 'Pie chart'}</span></header>
	<div class="rd-chart-pie__pie" aria-hidden="true"></div>
	{@render children?.()}
</section>
