import type { GeoMapAdapter, GeoMapAdapterOptions, GeoMapMarker, GeoMapView } from '../geo-map-types.js';
import { createNoopAdapter } from './provider-utils.js';

type GoogleMap = {
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
};

type GoogleMarker = {
  map: GoogleMap | null;
  addListener: (event: string, handler: () => void) => void;
};

type GoogleMapsLibrary = {
  Map: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => GoogleMap;
};

type GoogleMarkerLibrary = {
  Marker: new (options: Record<string, unknown>) => GoogleMarker;
};

export async function createGoogleMapsAdapter(
  options: GeoMapAdapterOptions,
): Promise<GeoMapAdapter> {
  if (!options.apiKey) {
    options.onError('Google Maps requires an api-key attribute.');
    return createNoopAdapter();
  }

  let mapsLibrary: GoogleMapsLibrary;
  let markerLibrary: GoogleMarkerLibrary;
  try {
    const { importLibrary, setOptions } = await import('@googlemaps/js-api-loader');
    setOptions({ key: options.apiKey, v: 'weekly' });
    mapsLibrary = (await importLibrary('maps')) as unknown as GoogleMapsLibrary;
    markerLibrary = (await importLibrary('marker')) as unknown as GoogleMarkerLibrary;
  } catch {
    options.onError(
      '@googlemaps/js-api-loader is not installed or failed to load. Add it as a dependency in your app.',
    );
    return createNoopAdapter();
  }

  const map = new mapsLibrary.Map(options.container, {
    center: { lat: options.view.lat, lng: options.view.lng },
    zoom: options.view.zoom,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  const markerHandles: GoogleMarker[] = [];
  let markerData: GeoMapMarker[] = options.markers;
  let selectedId = options.selectedId;

  const renderMarkers = () => {
    for (const handle of markerHandles.splice(0)) {
      handle.map = null;
    }
    for (const marker of markerData) {
      const handle = new markerLibrary.Marker({
        map,
        position: { lat: marker.lat, lng: marker.lng },
        title: marker.label ?? marker.id,
        label: marker.id === selectedId ? '★' : undefined,
      });
      handle.addListener('click', () => options.onMarkerSelect(marker));
      markerHandles.push(handle);
    }
  };

  renderMarkers();

  return {
    destroy() {
      for (const handle of markerHandles) {
        handle.map = null;
      }
      options.container.replaceChildren();
    },
    setMarkers(markers, nextSelectedId) {
      markerData = markers;
      selectedId = nextSelectedId;
      renderMarkers();
    },
    setView(view: GeoMapView) {
      map.setCenter({ lat: view.lat, lng: view.lng });
      map.setZoom(view.zoom);
    },
  };
}
