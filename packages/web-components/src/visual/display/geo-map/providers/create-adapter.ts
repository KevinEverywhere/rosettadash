import type { GeoMapAdapter, GeoMapAdapterOptions } from '../geo-map-types.js';

export async function createGeoMapAdapter(
  options: GeoMapAdapterOptions,
): Promise<GeoMapAdapter> {
  switch (options.provider) {
    case 'leaflet':
      return (await import('./leaflet-adapter.js')).createLeafletAdapter(options);
    case 'google-maps':
      return (await import('./google-maps-adapter.js')).createGoogleMapsAdapter(options);
    default:
      return (await import('./maplibre-adapter.js')).createMaplibreAdapter(options);
  }
}
