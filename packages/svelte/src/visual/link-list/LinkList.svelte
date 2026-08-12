<script lang="ts">
	import type { LinkListItem } from './types';

	interface Props {
		items?: LinkListItem[];
		className?: string;
		dense?: boolean;
	}

	let { items = [], className, dense = false }: Props = $props();

	const rootClass = $derived(
		['rd-link-list', dense ? 'rd-link-list--dense' : '', className]
			.filter(Boolean)
			.join(' '),
	);
</script>

<ul class={rootClass} data-testid="rd-link-list">
	{#each items as item (item.href + ':' + item.label)}
		<li class="rd-link-list__item">
			<a class="rd-link-list__link" href={item.href}>{item.label}</a>
		</li>
	{/each}
</ul>
