import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import {
  DB_GEO_MAP_TAG,
  registerRdGeoMap,
  type GeoMapMarker,
  type GeoMapProvider,
} from '@rosettadash/web-components/visual/display/geo-map';
import {
  attachHostEvents,
  setHostAttribute,
} from '../../../lib/custom-element-host';

export type { GeoMapMarker, GeoMapProvider };

/** Public props for visual/display/geo-map. */
export interface GeoMapProps {
  provider?: GeoMapProvider;
  tileUrl?: string;
  apiKey?: string;
  center?: string;
  zoom?: number;
  markers?: GeoMapMarker[];
  selectedId?: string;
  className?: string;
}

@Component({
  selector: DB_GEO_MAP_TAG,
  standalone: true,
  template: '',
})
export class GeoMap implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private detachEvents: (() => void) | undefined;
  private ready = false;

  readonly provider = input<GeoMapProvider | undefined>(undefined);
  readonly tileUrl = input<string | undefined>(undefined);
  readonly apiKey = input<string | undefined>(undefined);
  readonly center = input<string | undefined>(undefined);
  readonly zoom = input<number | undefined>(undefined);
  readonly markers = input<GeoMapMarker[] | undefined>(undefined);
  readonly selectedId = input<string | undefined>(undefined);
  readonly className = input<string | undefined>(undefined);

  readonly markerSelect = output<{ id: string; lat: number; lng: number }>();

  constructor() {
    effect(() => {
      this.provider();
      this.tileUrl();
      this.apiKey();
      this.center();
      this.zoom();
      this.markers();
      this.selectedId();
      this.className();
      if (this.ready) {
        this.syncFromInputs();
      }
    });
  }

  ngOnInit(): void {
    registerRdGeoMap();
    this.ready = true;
    this.syncFromInputs();
    this.detachEvents = attachHostEvents(this.host.nativeElement, {
      'marker-select': (detail: unknown) =>
        this.markerSelect.emit(detail as { id: string; lat: number; lng: number }),
    });
  }

  ngOnDestroy(): void {
    this.detachEvents?.();
  }

  private syncFromInputs(): void {
    const el = this.host.nativeElement;
    setHostAttribute(el, 'provider', this.provider());
    setHostAttribute(el, 'tile-url', this.tileUrl());
    setHostAttribute(el, 'api-key', this.apiKey());
    setHostAttribute(el, 'center', this.center());
    setHostAttribute(el, 'zoom', this.zoom());
    setHostAttribute(
      el,
      'markers',
      this.markers() ? JSON.stringify(this.markers()) : undefined,
    );
    setHostAttribute(el, 'selected-id', this.selectedId());
    if (this.className()) {
      el.setAttribute('class', this.className()!);
    } else {
      el.removeAttribute('class');
    }
  }
}
