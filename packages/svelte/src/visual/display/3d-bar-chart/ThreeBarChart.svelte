<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ThreeBarChartProps } from './types';

	type Props = ThreeBarChartProps & { children?: Snippet };

	let {
		className,
		title,
		mode,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-display-3d-bar-chart', className].filter(Boolean).join(' '));
</script>

<section
	class={rootClass}
	data-testid="rd-display-3d-bar-chart"
	data-three-mode={mode}
	data-three-title={title}
	aria-label={title ?? '3D host'}
>{@render children?.()}</section>
