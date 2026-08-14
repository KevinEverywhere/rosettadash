<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { NumberInputProps } from './types';

	type Props = NumberInputProps & { children?: Snippet };

	let {
		className,
		label,
		placeholder,
		min,
		max,
		step,
		value,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-input-number', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-input-number">
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	<input type="number" class="rd-input" placeholder={placeholder ?? ''} min={min} max={max} step={step} value={value} />
	{@render children?.()}
</section>
