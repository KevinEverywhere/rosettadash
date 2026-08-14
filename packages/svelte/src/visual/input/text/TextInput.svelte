<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TextInputProps } from './types';

	type Props = TextInputProps & { children?: Snippet };

	let {
		className,
		label,
		placeholder,
		required,
		value,
		defaultValue,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-input-text', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-input-text">
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	<input type="text" class="rd-input" placeholder={placeholder ?? ''} required={required ?? false} value={value ?? ''} />
	{@render children?.()}
</section>
