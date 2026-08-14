<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SelectInputProps } from './types';

	type Props = SelectInputProps & { children?: Snippet };

	let {
		className,
		label,
		placeholder,
		options,
		value,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-input-select', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-input-select">
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	<select class="rd-select" value={value ?? ''}>
		<option value="">{placeholder ?? 'Select…'}</option>
		{#each options ?? [] as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
	</select>
	{@render children?.()}
</section>
