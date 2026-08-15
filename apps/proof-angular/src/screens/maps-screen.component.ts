import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AtlasStateService } from '../services/atlas-state.service';
import { MapsPanelNavComponent } from '../components/maps-panel-nav.component';
import { MapScreenComponent } from './map-screen.component';
import { GlobeScreenComponent } from './globe-screen.component';
import {
  DaBoundSelectInputComponent,
} from '../components/proof-form-fields.component';
import type { GeoExplorerListPlacement } from '../components/geo-explorer-layout.component';

@Component({
  selector: 'da-maps-screen',
  standalone: true,
  imports: [
    MapsPanelNavComponent,
    MapScreenComponent,
    GlobeScreenComponent,
    DaBoundSelectInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="da-panel da-maps-panel" [class]="'da-maps-panel--' + atlas.mapsPanel()">
      <div class="da-maps-panel__body">
        <div class="da-maps-toolbar">
          <da-map-screen [screenPart]="'toolbar'" [embedded]="true" [listPlacement]="listPlacement()" />
          <da-bound-select-input
            [fieldLabel]="'Destination list placement'"
            [options]="listPlacementOptions"
            [value]="listPlacement()"
            (valueChange)="setListPlacement($event)"
          />
        </div>

        <da-maps-panel-nav [panel]="atlas.mapsPanel()" (selectPanel)="atlas.setMapsPanel($event)" />

        <div class="da-maps-explorer">
          @if (atlas.mapsPanel() === 'map') {
            <da-map-screen [screenPart]="'explorer'" [embedded]="true" [listPlacement]="listPlacement()" />
          } @else {
            <da-globe-screen [screenPart]="'explorer'" [embedded]="true" [listPlacement]="listPlacement()" />
          }
        </div>

        @if (atlas.mapsPanel() === 'globe') {
          <da-globe-screen [screenPart]="'footer'" [embedded]="true" />
        }
      </div>
    </section>
  `,
})
export class MapsScreenComponent {
  readonly atlas = inject(AtlasStateService);

  readonly listPlacement = signal<GeoExplorerListPlacement>('right');

  readonly listPlacementOptions = [
    { value: 'right', label: 'List on right' },
    { value: 'left', label: 'List on left' },
  ];

  setListPlacement(value: string): void {
    this.listPlacement.set(value === 'left' ? 'left' : 'right');
  }
}
