<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TextareaInputProps } from './types';

	type Props = TextareaInputProps & { children?: Snippet };

	let {
		className,
		label,
		placeholder,
		rows,
		value,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-input-textarea', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-input-textarea">
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	<textarea class="rd-textarea" rows={rows ?? 4} placeholder={placeholder ?? ''}>{value ?? ''}</textarea>
	{@render children?.()}
</section>
