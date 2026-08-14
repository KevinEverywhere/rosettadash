<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { NuxtServerInfraProps } from './types';

	type Props = NuxtServerInfraProps & { children?: Snippet };

	let {
		className,
		label,
		globalPrefix,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-server-nuxt', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-server-nuxt">
	<span class="rd-infra__badge">INFRA</span>
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	{#if globalPrefix}<code>globalPrefix: {globalPrefix}</code>{/if}
	{@render children?.()}
</section>
