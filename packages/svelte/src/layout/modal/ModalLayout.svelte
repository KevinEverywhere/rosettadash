<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ModalLayoutProps } from './types';

	type Props = ModalLayoutProps & { children?: Snippet };

	let {
		className,
		title,
		body,
		confirmLabel,
		open,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-modal', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-modal" role="dialog" aria-modal="true">
	<div class="rd-modal__dialog">
		<span class="rd-modal__title">{title ?? 'Dialog'}</span>
		{#if body}<p class="rd-modal__body">{body}</p>{/if}
		<button type="button" class="rd-modal__confirm">{confirmLabel ?? 'Confirm'}</button>
		{@render children?.()}
	</div>
</section>
