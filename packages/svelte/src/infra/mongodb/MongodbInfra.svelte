<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MongodbInfraProps } from './types';

	type Props = MongodbInfraProps & { children?: Snippet };

	let {
		className,
		label,
		envKey,
		tableOrCollection,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-mongodb', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-mongodb">
	<span class="rd-infra__badge">INFRA</span>
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	{#if envKey}<code>{envKey}</code>{/if}
	{#if tableOrCollection}<span class="rd-infra__meta">{tableOrCollection}</span>{/if}
	{@render children?.()}
</section>
