<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ThreeScatterPlotProps } from './types';

	type Props = ThreeScatterPlotProps & { children?: Snippet };

	let {
		className,
		title,
		mode,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-display-3d-scatter', className].filter(Boolean).join(' '));
</script>

<section
	class={rootClass}
	data-testid="rd-display-3d-scatter"
	data-three-mode={mode}
	data-three-title={title}
	aria-label={title ?? '3D host'}
>{@render children?.()}</section>
