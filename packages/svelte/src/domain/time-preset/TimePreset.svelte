<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TimePresetProps } from './types';

	type Props = TimePresetProps & { children?: Snippet };

	let {
		className,
		label,
		presets,
		activePresetId,
		children,
	}: Props = $props();
	function presetButtonClass(id: string): string {
		return ['rd-time-preset__button', activePresetId === id ? 'rd-time-preset__button--active' : ''].filter(Boolean).join(' ');
	}
	const rootClass = $derived(['rd-time-preset', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-time-preset">
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	<div class="rd-time-preset__buttons" role="group">
		{#each presets ?? [] as p (p.id)}<button type="button" class={presetButtonClass(p.id)}>{p.label}</button>{/each}
	</div>
	{@render children?.()}
</section>
