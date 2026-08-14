<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { BarChartProps } from './types';

	type Props = BarChartProps & { children?: Snippet };

	let {
		className,
		title,
		children,
	}: Props = $props();
	const barHeights = [40, 65, 55, 80, 48];
	const rootClass = $derived(['rd-chart-bar', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-chart-bar">
	<header class="rd-chart-bar__header"><span>{title ?? 'Bar chart'}</span></header>
	<div class="rd-chart-bar__bars" aria-hidden="true">
		{#each barHeights as h, i (i)}<div class="rd-chart-bar__bar-wrap"><div class="rd-chart-bar__bar" style:height="{h}%"></div></div>{/each}
	</div>
	{@render children?.()}
</section>
