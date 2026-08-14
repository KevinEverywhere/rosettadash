<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { RoleAssignProps } from './types';

	type Props = RoleAssignProps & { children?: Snippet };

	let {
		className,
		summary,
		roleOptions,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-role-assign', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-role-assign">
	<span class="rd-field__label">Assign role</span>
	{#if summary}<p class="rd-onboarding__summary">{summary}</p>{/if}
	<select class="rd-select">
		{#each roleOptions ?? [] as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
	</select>
	<button type="button" class="rd-button">Confirm access</button>
	{@render children?.()}
</section>
