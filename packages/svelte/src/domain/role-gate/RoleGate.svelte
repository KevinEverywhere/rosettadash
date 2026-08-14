<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { RoleGateProps } from './types';

	type Props = RoleGateProps & { children?: Snippet };

	let {
		className,
		label,
		allowedRoles,
		statusText,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-role-gate', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-role-gate">
	{#if label}<span class="rd-field__label">{label}</span>{/if}
	<p class="rd-role-gate__status">{statusText ?? 'Visible'}</p>
	{@render children?.()}
</section>
