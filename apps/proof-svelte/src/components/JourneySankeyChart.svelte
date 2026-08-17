<script lang="ts">
  import { JourneySankeyChart as JourneySankeyChartReact } from '@rosettadash/react/visual/chart/sankey';
  import ReactMount from './ReactMount.svelte';

  export type SankeyNode = { id: string; label: string };
  export type SankeyLink = { source: string; target: string; value: number };

  let {
    title,
    nodes = [],
    links = [],
  }: {
    title?: string;
    nodes?: SankeyNode[];
    links?: SankeyLink[];
  } = $props();

  const componentProps = $derived({ title, nodes, links });
</script>

<ReactMount component={JourneySankeyChartReact} {componentProps} />
