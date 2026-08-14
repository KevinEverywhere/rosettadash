<script lang="ts">
	import type { StatusBadgeProps } from './types';

	type Props = StatusBadgeProps;

	let {
		className,
		statusText,
		tone,
	}: Props = $props();
	const badgeClass = $derived(['rd-plugin-status-badge', 'rd-plugin-status-badge--' + (tone ?? 'success'), className].filter(Boolean).join(' '));
</script>

<span class={badgeClass} data-testid="rd-plugin-status-badge">{statusText ?? 'Active'}</span>
