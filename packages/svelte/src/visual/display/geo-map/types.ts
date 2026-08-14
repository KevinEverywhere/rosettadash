import type { GeoMapMarker, GeoMapProvider } from '@rosettadash/web-components/visual/display/geo-map';

export type { GeoMapMarker, GeoMapProvider };

export interface GeoMapProps {
  provider?: GeoMapProvider;
  tileUrl?: string;
  apiKey?: string;
  center?: string;
  zoom?: number;
  markers?: GeoMapMarker[];
  selectedId?: string;
  className?: string;
  onMarkerSelect?: (detail: { id: string; lat: number; lng: number }) => void;
}

export { default as GeoMap } from './GeoMap.svelte';
