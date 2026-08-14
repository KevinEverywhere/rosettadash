<script lang="ts">
	import type { MetricChipProps } from './types';

	type Props = MetricChipProps;

	let {
		className,
		chipLabel,
		chipValue,
	}: Props = $props();
	const rootClass = $derived(['rd-plugin-metric-chip', className].filter(Boolean).join(' '));
</script>

<span class={rootClass} data-testid="rd-plugin-metric-chip">
	<span class="rd-plugin-metric-chip__label">{chipLabel ?? 'Metric'}</span>
	<span class="rd-plugin-metric-chip__value">{chipValue ?? '—'}</span>
</span>
