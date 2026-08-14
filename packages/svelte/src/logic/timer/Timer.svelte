<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TimerProps } from './types';

	type Props = TimerProps & { children?: Snippet };

	let {
		className,
		label,
		mode,
		intervalMs,
		tickCount,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-timer', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-timer">
	{#if label}<span class="rd-timer__label">{label}</span>{/if}
	<span class="rd-timer__value">{tickCount ?? 0} ticks</span>
	{@render children?.()}
</section>
