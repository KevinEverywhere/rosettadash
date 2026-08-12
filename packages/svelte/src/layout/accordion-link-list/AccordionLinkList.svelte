<script lang="ts">
	import Accordion from '../accordion/Accordion.svelte';
	import LinkList from '../../visual/link-list/LinkList.svelte';
	import type { LinkListItem } from '../../visual/link-list/types';

	interface Props {
		title: string;
		open?: boolean;
		defaultOpen?: boolean;
		className?: string;
		items?: LinkListItem[];
		dense?: boolean;
	}

	let {
		title,
		defaultOpen = false,
		open = $bindable(defaultOpen),
		className,
		items = [],
		dense = false,
	}: Props = $props();

	const recipeClass = $derived(
		['rd-accordion-link-list', className].filter(Boolean).join(' '),
	);
</script>

<Accordion {title} bind:open {defaultOpen} className={recipeClass}>
	<LinkList {items} {dense} />
</Accordion>
