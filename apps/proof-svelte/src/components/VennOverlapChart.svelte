<script lang="ts">
  import { VennOverlapChart as VennOverlapChartReact } from '@rosettadash/react/visual/chart/venn';
  import ReactMount from './ReactMount.svelte';

  export type VennSet = { id: string; label: string; count: number; color?: string };
  export type VennOverlap = { setIds: string[]; count: number; label?: string };

  let {
    title,
    sets = [],
    overlaps = [],
  }: {
    title?: string;
    sets?: VennSet[];
    overlaps?: VennOverlap[];
  } = $props();

  const componentProps = $derived({ title, sets, overlaps });
</script>

<ReactMount component={VennOverlapChartReact} {componentProps} />
