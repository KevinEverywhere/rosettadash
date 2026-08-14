export type GeoMapProvider = 'maplibre' | 'leaflet' | 'google-maps';

export interface GeoMapMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

export interface GeoMapView {
  lat: number;
  lng: number;
  zoom: number;
}

export interface GeoMapAdapterOptions {
  container: HTMLElement;
  provider: GeoMapProvider;
  view: GeoMapView;
  markers: GeoMapMarker[];
  selectedId?: string;
  tileUrl?: string;
  apiKey?: string;
  onMarkerSelect: (marker: GeoMapMarker) => void;
  onError: (message: string) => void;
}

export interface GeoMapAdapter {
  destroy(): void;
  setMarkers(markers: GeoMapMarker[], selectedId?: string): void;
  setView(view: GeoMapView): void;
}

export const DEFAULT_GEO_MAP_VIEW: GeoMapView = { lat: 20, lng: 0, zoom: 2 };

export const DEFAULT_MAPLIBRE_STYLE = 'https://demotiles.maplibre.org/style.json';

export const DEFAULT_LEAFLET_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export function normalizeGeoMapProvider(value: string | null | undefined): GeoMapProvider {
  if (value === 'leaflet' || value === 'google-maps') {
    return value;
  }
  return 'maplibre';
}
