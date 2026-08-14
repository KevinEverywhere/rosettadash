<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { CollapsibleProps } from './types';

	type Props = CollapsibleProps & { children?: Snippet };

	let {
		className,
		title,
		open,
		defaultOpen,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-collapsible', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-collapsible">
	<button type="button" class="rd-collapsible__header" aria-expanded={(open ?? defaultOpen ?? false) ? 'true' : 'false'}>
		<span>{title ?? 'Section'}</span>
	</button>
	<div class="rd-collapsible__panel">{@render children?.()}</div>
</section>
