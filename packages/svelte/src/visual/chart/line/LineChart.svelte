<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LineChartProps } from './types';

	type Props = LineChartProps & { children?: Snippet };

	let {
		className,
		title,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-chart-line', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-chart-line">
	<header class="rd-chart-line__header"><span>{title ?? 'Line chart'}</span></header>
	<svg viewBox="0 0 240 96" class="rd-chart-line__svg" aria-hidden="true">
		<polyline class="rd-chart-line__line" points="0,80 40,60 80,65 120,40 160,45 200,20 240,30" />
	</svg>
	{@render children?.()}
</section>
