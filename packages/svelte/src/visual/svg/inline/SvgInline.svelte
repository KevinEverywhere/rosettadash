<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvgInlineProps } from './types';

	type Props = SvgInlineProps & { children?: Snippet };

	let {
		className,
		markup,
		width,
		height,
		children,
	}: Props = $props();
	const defaultSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/></svg>';
	const rootClass = $derived(['rd-svg-inline', className].filter(Boolean).join(' '));
</script>

<div
	class={rootClass}
	data-testid="rd-svg-inline"
	style:width="{width ?? 96}px"
	style:height="{height ?? 96}px"
>
	{@html markup ?? defaultSvg}
</div>
