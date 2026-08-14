<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PersonInviteProps } from './types';

	type Props = PersonInviteProps & { children?: Snippet };

	let {
		className,
		emailPlaceholder,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-person-invite', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-person-invite">
	<span class="rd-field__label">Invite team member</span>
	<input type="email" class="rd-input" placeholder={emailPlaceholder ?? 'name@company.com'} />
	<button type="button" class="rd-button">Send invite</button>
	{@render children?.()}
</section>
