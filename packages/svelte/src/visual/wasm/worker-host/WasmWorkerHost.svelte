<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { WasmWorkerHostProps } from './types';

	type Props = WasmWorkerHostProps & { children?: Snippet };

	let {
		className,
		workerLabel,
		workerStatus,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-wasm-worker-host', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-wasm-worker-host">
	<span class="rd-wasm__label">{workerLabel ?? 'Worker'}</span>
	<span class="rd-wasm__status">{workerStatus ?? 'Idle'}</span>
	{@render children?.()}
</section>
