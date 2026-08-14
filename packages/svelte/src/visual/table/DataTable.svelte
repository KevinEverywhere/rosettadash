<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DataTableProps } from './types';

	type Props = DataTableProps & { children?: Snippet };

	let {
		className,
		title,
		rows,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-table', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-table">
	<header class="rd-table__header"><span>{title ?? 'Data table'}</span></header>
	<table class="rd-table__table">
		<thead><tr><th>Name</th><th>Status</th><th>Amount</th><th>Date</th></tr></thead>
		<tbody>
			{#each rows ?? [] as row (row.id)}
			<tr><td>{row.name}</td><td>{row.status}</td><td>{row.amount}</td><td>{row.date}</td></tr>
			{/each}
		</tbody>
	</table>
	{@render children?.()}
</section>
