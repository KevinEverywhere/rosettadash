<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { NewsResultsTableProps } from './types';

	type Props = NewsResultsTableProps & { children?: Snippet };

	let {
		className,
		title,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-news-results-table', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-news-results-table">
	<header class="rd-table__header"><span>{title ?? 'News results'}</span></header>
	<table class="rd-table"><thead><tr><th>Headline</th><th>Source</th><th>Region</th><th>Published</th></tr></thead><tbody></tbody></table>
	{@render children?.()}
</section>
