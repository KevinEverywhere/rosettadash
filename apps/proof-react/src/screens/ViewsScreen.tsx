import { JourneySankeyChart } from '@rosettadash/react/visual/chart/sankey';
import { VennOverlapChart } from '@rosettadash/react/visual/chart/venn';
import { SlideCarousel } from '@rosettadash/react/visual/media/carousel';
import { ThreeScatterPlot } from '@rosettadash/react/visual/display/3d-scatter';
import {
  MOCK_DESTINATIONS,
  TRAVEL_INTEREST_VENN,
  TRAVEL_JOURNEY_SANKEY,
  destinationThumbnailUrl,
  formatVisitorCount,
} from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { localizedDestinationName } from '../lib/atlas-utils';

export const VIEWS_SOURCE = `<ViewsScreen locale={locale} selectedId={selectedId}>
  <JourneySankeyChart nodes={…} links={…} />
  <VennOverlapChart sets={…} overlaps={…} />
  <ThreeScatterPlot points={scatterPoints} xAxisLabel="Trip price (USD)" />
  <SlideCarousel slides={carouselSlides} selectedId={selectedId} />
</ViewsScreen>`;

type Props = Pick<AtlasContext, 'locale' | 'selectedId' | 'setSelectedId'>;

export function ViewsScreen({ locale, selectedId, setSelectedId }: Props) {
  const scatterPoints = MOCK_DESTINATIONS.map((dest) => ({
    id: dest.id,
    label: localizedDestinationName(dest, locale),
    x: dest.avgTripPriceUsd ?? 0,
    y: dest.hubDistanceKm ?? 0,
    z: dest.travelRating ?? 0,
  }));

  const carouselSlides = MOCK_DESTINATIONS.map((dest) => ({
    id: dest.id,
    title: localizedDestinationName(dest, locale),
    subtitle: `${formatVisitorCount(dest.visitorsCurrent)} visitors · ★ ${dest.travelRating?.toFixed(1) ?? '—'}`,
    imageUrl: destinationThumbnailUrl(dest),
  }));

  return (
    <section className="da-panel">
      <h2>Views</h2>
      <p>Advanced charting and media navigation — journey flows, audience overlap, 3D scatter, and destination carousel.</p>

      <div className="da-views-grid">
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
        <ThreeScatterPlot
          title="Destination value space (3D)"
          points={scatterPoints}
          selectedId={selectedId}
          onPointSelect={setSelectedId}
          xAxisLabel="Trip price (USD)"
          yAxisLabel="Hub distance (km)"
          zAxisLabel="Traveler rating"
        />
        <SlideCarousel
          title="Destination highlights"
          slides={carouselSlides}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </section>
  );
}
