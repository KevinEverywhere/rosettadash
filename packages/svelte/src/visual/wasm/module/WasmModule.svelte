<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { WasmModuleProps } from './types';

	type Props = WasmModuleProps & { children?: Snippet };

	let {
		className,
		moduleLabel,
		exportName,
		children,
	}: Props = $props();
	const exportFnLabel = $derived(exportName ?? 'run()');
	const rootClass = $derived(['rd-wasm-module', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-wasm-module">
	<span class="rd-wasm__label">{moduleLabel ?? 'WASM Module'}</span>
	<code>{exportFnLabel}()</code>
	{@render children?.()}
</section>
