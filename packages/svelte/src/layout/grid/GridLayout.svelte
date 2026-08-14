<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { GridLayoutProps } from './types';

	type Props = GridLayoutProps & { children?: Snippet };

	let {
		className,
		title,
		columns,
		gap,
		children,
	}: Props = $props();
	const gridColumns = $derived(`repeat(${columns ?? 3}, 1fr)`);
	const gridGap = $derived(typeof gap === 'number' ? gap : 12);
	const rootClass = $derived(['rd-grid', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-grid">
	{#if title}<span class="rd-grid__title">{title}</span>{/if}
	<div class="rd-grid__grid" style:grid-template-columns={gridColumns} style:gap="{gridGap}px">{@render children?.()}</div>
</section>
