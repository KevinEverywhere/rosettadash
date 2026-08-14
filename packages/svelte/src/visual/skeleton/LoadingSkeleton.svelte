<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LoadingSkeletonProps } from './types';

	type Props = LoadingSkeletonProps & { children?: Snippet };

	let {
		className,
		lines,
		children,
	}: Props = $props();
	const skeletonLines = $derived.by(() => {
		const count = lines ?? 4;
		return Array.from({ length: count }, (_, i) =>
			['rd-skeleton__line', i === 2 ? 'rd-skeleton__line--short' : ''].filter(Boolean).join(' '),
		);
	});
	const rootClass = $derived(['rd-skeleton', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-skeleton">
	{#each skeletonLines as line, i (i)}<span class={line}></span>{/each}
	{@render children?.()}
</section>
