<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		open?: boolean;
		defaultOpen?: boolean;
		className?: string;
		children?: Snippet;
	}

	let {
		title,
		defaultOpen = false,
		open = $bindable(defaultOpen),
		className,
		children,
	}: Props = $props();

	function toggle(): void {
		open = !open;
	}

	const rootClass = $derived(
		['rd-accordion', open ? 'rd-accordion--open' : '', className]
			.filter(Boolean)
			.join(' '),
	);
</script>

<section class={rootClass} data-testid="rd-accordion">
	<button
		type="button"
		class="rd-accordion__header"
		aria-expanded={open}
		aria-controls="rd-accordion-panel"
		onclick={toggle}
	>
		<span class="rd-accordion__title">{title}</span>
		<span class="rd-accordion__chevron" aria-hidden="true">›</span>
	</button>
	{#if open}
		<div class="rd-accordion__panel" id="rd-accordion-panel" role="region">
			{@render children?.()}
		</div>
	{/if}
</section>
