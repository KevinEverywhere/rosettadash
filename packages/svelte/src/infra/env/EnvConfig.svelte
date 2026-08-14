<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { EnvConfigProps } from './types';

	type Props = EnvConfigProps & { children?: Snippet };

	let {
		className,
		envKeys,
		children,
	}: Props = $props();
	const rootClass = $derived(['rd-env', className].filter(Boolean).join(' '));
</script>

<section class={rootClass} data-testid="rd-env">
	<span class="rd-infra__badge">INFRA</span>
	<span class="rd-field__label">Environment config</span>
	<code>{envKeys ?? 'DATABASE_URL, API_KEY'}</code>
	{@render children?.()}
</section>
