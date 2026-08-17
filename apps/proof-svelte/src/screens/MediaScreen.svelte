<script module lang="ts">
  export const MEDIA_SOURCE = `<MediaScreen selectedId={selectedId}>
  <SelectInput label="Flat video (YouTube)" />
  <SelectInput label="360° video (Authoring)" />
  <YoutubeEmbed videoId={…} controls />
  <VideoMetadataPanel items={…} />
</MediaScreen>`;
</script>

<script lang="ts">
  import YoutubeEmbed from '@rosettadash/svelte/visual/media/youtube-embed';
  import {
    EQUIRECT_VIDEO_DESTINATIONS,
    FLAT_VIDEO_DESTINATIONS,
    destinationHasFlatVideo,
    getDestinationById,
    isEquirectDestination,
  } from '@destination-atlas';
  import BoundSelectInput from '../components/BoundSelectInput.svelte';
  import VideoMetadataPanel from '../components/VideoMetadataPanel.svelte';
  import { localizedDestinationName } from '../lib/atlas-utils';

  let {
    locale,
    selectedId,
    onSelectedIdChange,
    onOpenAuthoring,
  }: {
    locale: string;
    selectedId: string;
    onSelectedIdChange?: (id: string) => void;
    onOpenAuthoring?: (id: string) => void;
  } = $props();

  const selected = $derived(getDestinationById(selectedId));
  const flatSelected = $derived(
    selected && destinationHasFlatVideo(selected) ? selected : undefined,
  );
  const equirectSelected = $derived(
    selected && isEquirectDestination(selected) ? selected : undefined,
  );

  $effect(() => {
    if (equirectSelected) {
      onOpenAuthoring?.(equirectSelected.id);
    }
  });

  const metadataItems = $derived(
    flatSelected
      ? [
          { label: 'Destination', value: localizedDestinationName(flatSelected, locale) },
          { label: 'Source', value: 'YouTube embed' },
          { label: 'Projection', value: 'Flat / standard' },
          { label: 'Video id', value: flatSelected.youtubeId ?? '—' },
          { label: 'Region', value: flatSelected.region },
        ]
      : [],
  );
</script>

<section class="da-panel">
  <h2>Media</h2>
  <p>
    Watch flat destination videos here. 360° equirectangular locations open in
    <strong>Authoring</strong> — upload your source and frame the export there.
  </p>
  <div class="rd-media-layout">
    <div class="rd-media-primary">
      <BoundSelectInput
        fieldLabel="Flat video (YouTube)"
        options={FLAT_VIDEO_DESTINATIONS.map((dest) => ({
          value: dest.id,
          label: localizedDestinationName(dest, locale),
        }))}
        value={flatSelected?.id ?? ''}
        onValueChange={(value) => onSelectedIdChange?.(value)}
      />
      {#if flatSelected?.youtubeId}
        <YoutubeEmbed
          className="rd-youtube-embed-host"
          videoId={flatSelected.youtubeId}
          title={`${localizedDestinationName(flatSelected, locale)} — destination video`}
          controls
        />
      {:else}
        <p class="da-note">Select a flat destination video to play the YouTube embed.</p>
      {/if}

      <BoundSelectInput
        fieldLabel="360° video (Authoring)"
        options={EQUIRECT_VIDEO_DESTINATIONS.map((dest) => ({
          value: dest.id,
          label: `${localizedDestinationName(dest, locale)} · 360°`,
        }))}
        value={equirectSelected?.id ?? ''}
        onValueChange={(value) => onOpenAuthoring?.(value)}
      />
      <p class="da-note">
        Choosing a 360° destination switches to the Authoring tab to upload and frame your equirect source.
      </p>
    </div>
    <div class="rd-media-tools">
      <VideoMetadataPanel items={metadataItems} />
    </div>
  </div>
</section>
