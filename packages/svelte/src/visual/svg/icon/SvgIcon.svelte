<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvgIconProps } from './types';

	type Props = SvgIconProps & { children?: Snippet };

	let {
		className,
		markup,
		title,
		color,
		size,
		children,
	}: Props = $props();
	const defaultIconSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" fill="currentColor"/></svg>';
	const rootClass = $derived(['rd-svg-icon', className].filter(Boolean).join(' '));
</script>

<span
	class={rootClass}
	data-testid="rd-svg-icon"
	style:width="{size ?? 28}px"
	style:height="{size ?? 28}px"
	style:color={color}
	title={title ?? ''}
>
	{@html markup ?? defaultIconSvg}
</span>
