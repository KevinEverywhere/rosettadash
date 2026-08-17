<script lang="ts">
  export interface VideoMetadataItem {
    label: string;
    value: string;
  }

  let {
    panelTitle = 'Video characteristics',
    items = [],
  }: {
    panelTitle?: string;
    items?: VideoMetadataItem[];
  } = $props();
</script>

<section class="rd-video-metadata" data-testid="rd-video-metadata">
  <h3 class="rd-video-metadata__title">{panelTitle}</h3>
  <dl class="rd-video-metadata__list">
    {#each items as item (item.label)}
      <div>
        <dt>{item.label}</dt>
        <dd>{item.value}</dd>
      </div>
    {/each}
  </dl>
</section>
