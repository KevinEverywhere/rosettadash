<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { NewsSearchBoxProps } from './types';

	type Props = NewsSearchBoxProps & { children?: Snippet };

	let {
		className,
		label,
		placeholder,
		value,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-news-search-box', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-news-search-box">
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	<div class="rd-search__row">
		<input type="search" class="rd-input" placeholder={placeholder ?? 'Search news…'} value={value ?? ''} />
		<button type="button" class="rd-button">Search</button>
	</div>
	{@render children?.()}
</section>
