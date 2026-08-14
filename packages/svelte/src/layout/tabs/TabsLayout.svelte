<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TabsLayoutProps } from './types';

	type Props = TabsLayoutProps & { children?: Snippet };

	let {
		className,
		title,
		tabs,
		activeTabId,
		children,
	}: Props = $props();
	function tabClass(id: string): string {
		return ['rd-tabs__tab', activeTabId === id ? 'rd-tabs__tab--active' : ''].filter(Boolean).join(' ');
	}
	const rootClass = $derived(['rd-tabs', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-tabs">
	{#if title}<span class="rd-tabs__title">{title}</span>{/if}
	<div class="rd-tabs__tabs" role="tablist">
		{#each tabs ?? [] as tab (tab.id)}<button type="button" role="tab" class={tabClass(tab.id)}>{tab.label}</button>{/each}
	</div>
	<div class="rd-tabs__panel">{@render children?.()}</div>
</section>
