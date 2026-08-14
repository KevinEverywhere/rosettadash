<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { CheckboxInputProps } from './types';

	type Props = CheckboxInputProps & { children?: Snippet };

	let {
		className,
		label,
		checked,
		defaultChecked,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-input-checkbox', className].filter(Boolean).join(' '));
</script>

<label class="{rootClass} rd-field--checkbox" data-testid="rd-input-checkbox">
	<input type="checkbox" class="rd-checkbox" checked={checked ?? defaultChecked ?? false} />
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	{@render children?.()}
</label>
