import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThreeScatterPlot } from '@rosettadash/angular/visual/display/3d-scatter';
import {
  MOCK_DESTINATIONS,
  TRAVEL_INTEREST_VENN,
  TRAVEL_JOURNEY_SANKEY,
  destinationThumbnailUrl,
  formatVisitorCount,
} from '@destination-atlas';
import { localizedDestinationName } from '../lib/atlas-utils';
import { AtlasStateService } from '../services/atlas-state.service';
import { JourneySankeyChartComponent } from '../components/journey-sankey-chart.component';
import { VennOverlapChartComponent } from '../components/venn-overlap-chart.component';
import { SlideCarouselComponent } from '../components/slide-carousel.component';

@Component({
  selector: 'da-views-screen',
  standalone: true,
  imports: [
    ThreeScatterPlot,
    JourneySankeyChartComponent,
    VennOverlapChartComponent,
    SlideCarouselComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="da-panel">
      <h2>Views</h2>
      <p>
        Advanced charting and media navigation — journey flows, audience overlap, 3D scatter, and
        destination carousel.
      </p>

      <div class="da-views-grid">
        <da-journey-sankey-chart
          title="Travel journey flow"
          [nodes]="sankeyNodes"
          [links]="sankeyLinks"
        />
        <da-venn-overlap-chart
          title="Traveler interest overlap"
          [sets]="vennSets"
          [overlaps]="vennOverlaps"
        />
        <rd-display-3d-scatter title="Destination value space (3D)">
          <p class="da-note">
            3D scatter for {{ scatterPoints().length }} destinations — select
            <strong>{{ activeLabel() }}</strong> in the carousel below. Angular runtime uses the
            Three.js host stub; point selection syncs with destination context.
          </p>
        </rd-display-3d-scatter>
        <da-slide-carousel
          title="Destination highlights"
          [slides]="carouselSlides()"
          [selectedId]="atlas.selectedId()"
          (select)="atlas.setSelectedId($event)"
        />
      </div>
    </section>
  `,
})
export class ViewsScreenComponent {
  readonly atlas = inject(AtlasStateService);

  readonly sankeyNodes = TRAVEL_JOURNEY_SANKEY.nodes;
  readonly sankeyLinks = TRAVEL_JOURNEY_SANKEY.links;
  readonly vennSets = TRAVEL_INTEREST_VENN.sets;
  readonly vennOverlaps = TRAVEL_INTEREST_VENN.overlaps;

  readonly scatterPoints = computed(() =>
    MOCK_DESTINATIONS.map((dest) => ({
      id: dest.id,
      label: localizedDestinationName(dest, this.atlas.locale()),
      x: dest.avgTripPriceUsd ?? 0,
      y: dest.hubDistanceKm ?? 0,
      z: dest.travelRating ?? 0,
    })),
  );

  readonly carouselSlides = computed(() =>
    MOCK_DESTINATIONS.map((dest) => ({
      id: dest.id,
      title: localizedDestinationName(dest, this.atlas.locale()),
      subtitle: `${formatVisitorCount(dest.visitorsCurrent)} visitors · ★ ${dest.travelRating?.toFixed(1) ?? '—'}`,
      imageUrl: destinationThumbnailUrl(dest),
    })),
  );

  readonly activeLabel = computed(() => {
    const point = this.scatterPoints().find((entry) => entry.id === this.atlas.selectedId());
    return point?.label ?? 'a destination';
  });
}
