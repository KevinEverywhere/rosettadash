<script module lang="ts">
  export const VIEWS_SOURCE = `<ViewsScreen locale={locale} selectedId={selectedId}>
  <JourneySankeyChart nodes={…} links={…} />
  <VennOverlapChart sets={…} overlaps={…} />
  <ThreeScatterPlot points={scatterPoints} xAxisLabel="Trip price (USD)" />
  <SlideCarousel slides={carouselSlides} selectedId={selectedId} />
</ViewsScreen>`;
</script>

<script lang="ts">
  import ThreeScatterPlot from '@rosettadash/svelte/visual/display/3d-scatter';
  import {
    MOCK_DESTINATIONS,
    TRAVEL_INTEREST_VENN,
    TRAVEL_JOURNEY_SANKEY,
    destinationThumbnailUrl,
    formatVisitorCount,
  } from '@destination-atlas';
  import JourneySankeyChart from '../components/JourneySankeyChart.svelte';
  import VennOverlapChart from '../components/VennOverlapChart.svelte';
  import SlideCarousel from '../components/SlideCarousel.svelte';
  import { localizedDestinationName } from '../lib/atlas-utils';

  let {
    locale,
    selectedId,
    onSelectedIdChange,
  }: {
    locale: string;
    selectedId: string;
    onSelectedIdChange?: (id: string) => void;
  } = $props();

  const scatterPoints = $derived(
    MOCK_DESTINATIONS.map((dest) => ({
      id: dest.id,
      label: localizedDestinationName(dest, locale),
      x: dest.avgTripPriceUsd ?? 0,
      y: dest.hubDistanceKm ?? 0,
      z: dest.travelRating ?? 0,
    })),
  );

  const carouselSlides = $derived(
    MOCK_DESTINATIONS.map((dest) => ({
      id: dest.id,
      title: localizedDestinationName(dest, locale),
      subtitle: `${formatVisitorCount(dest.visitorsCurrent)} visitors · ★ ${dest.travelRating?.toFixed(1) ?? '—'}`,
      imageUrl: destinationThumbnailUrl(dest),
    })),
  );
</script>

<section class="da-panel">
  <h2>Views</h2>
  <p>Advanced charting and media navigation — journey flows, audience overlap, 3D scatter, and destination carousel.</p>

  <div class="da-views-grid">
    <JourneySankeyChart
      title="Travel journey flow"
      nodes={TRAVEL_JOURNEY_SANKEY.nodes}
      links={TRAVEL_JOURNEY_SANKEY.links}
    />
    <VennOverlapChart
      title="Traveler interest overlap"
      sets={TRAVEL_INTEREST_VENN.sets}
      overlaps={TRAVEL_INTEREST_VENN.overlaps}
    />
    <ThreeScatterPlot title="Destination value space (3D)" />
    <p class="da-note">
      Three.js scatter stub — {scatterPoints.length} destinations (selected:
      {selectedId}).
    </p>
    <SlideCarousel
      title="Destination highlights"
      slides={carouselSlides}
      {selectedId}
      onSelect={(id) => onSelectedIdChange?.(id)}
    />
  </div>
</section>
