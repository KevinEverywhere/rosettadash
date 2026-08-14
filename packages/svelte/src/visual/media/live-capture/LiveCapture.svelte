<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LiveCaptureProps } from './types';

	type Props = LiveCaptureProps & { children?: Snippet };

	let {
		className,
		label,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-media-live-capture', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-media-live-capture">
	<span class="rd-media__label">{label ?? 'Live capture'}</span>
	<button type="button" class="rd-button">Start camera</button>
	{@render children?.()}
</section>
