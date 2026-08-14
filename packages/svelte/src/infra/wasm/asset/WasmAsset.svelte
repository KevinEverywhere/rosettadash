<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { WasmAssetProps } from './types';

	type Props = WasmAssetProps & { children?: Snippet };

	let {
		className,
		assetPath,
		gluePath,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-wasm-asset', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-wasm-asset">
	<span class="rd-wasm__badge">WASM</span>
	<code>{assetPath ?? 'wasm/modules/example.wasm'}</code>
	{#if gluePath}<span class="rd-wasm__glue">+ {gluePath}</span>{/if}
	{@render children?.()}
</section>
