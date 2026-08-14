<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { NewsArticleDetailProps } from './types';

	type Props = NewsArticleDetailProps & { children?: Snippet };

	let {
		className,
		title,
		emptyMessage,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-news-article-detail', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-news-article-detail">
	<header class="rd-detail__header"><span>{title ?? 'Article'}</span></header>
	<p class="rd-detail__empty">{emptyMessage ?? 'Select a headline in News Results'}</p>
	{@render children?.()}
</section>
