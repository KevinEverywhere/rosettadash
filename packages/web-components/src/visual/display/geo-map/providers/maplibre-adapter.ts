import type { GeoMapAdapter, GeoMapAdapterOptions, GeoMapMarker, GeoMapView } from '../geo-map-types.js';
import { DEFAULT_MAPLIBRE_STYLE } from '../geo-map-types.js';
import { createNoopAdapter, injectStylesheet, PROVIDER_STYLESHEETS } from './provider-utils.js';

type MapLibreMap = {
  remove: () => void;
  on: (event: string, handler: () => void) => void;
  flyTo: (options: { center: [number, number]; zoom: number }) => void;
};

type MapLibreMarker = {
  remove: () => void;
  setLngLat: (lngLat: [number, number]) => MapLibreMarker;
  addTo: (map: MapLibreMap) => MapLibreMarker;
  getElement: () => HTMLElement;
};

export async function createMaplibreAdapter(
  options: GeoMapAdapterOptions,
): Promise<GeoMapAdapter> {
  const shadowRoot = options.container.getRootNode() as ShadowRoot;
  if (!(shadowRoot instanceof ShadowRoot)) {
    options.onError('Geo map container must live inside a shadow root.');
    return createNoopAdapter();
  }

  let maplibregl: {
    Map: new (opts: Record<string, unknown>) => MapLibreMap;
    Marker: new (opts?: { color?: string }) => MapLibreMarker;
  };

  try {
    const module = await import('maplibre-gl');
    maplibregl = module as unknown as typeof maplibregl;
  } catch {
    options.onError('maplibre-gl is not installed. Add it as a dependency in your app.');
    return createNoopAdapter();
  }

  try {
    await injectStylesheet(shadowRoot, 'rd-geo-map-maplibre-css', PROVIDER_STYLESHEETS.maplibre);
  } catch {
    options.onError('Failed to load MapLibre stylesheet.');
    return createNoopAdapter();
  }

  const map = new maplibregl.Map({
    container: options.container,
    style: options.tileUrl || DEFAULT_MAPLIBRE_STYLE,
    center: [options.view.lng, options.view.lat],
    zoom: options.view.zoom,
    attributionControl: true,
  });

  const markerHandles: MapLibreMarker[] = [];
  let markerData: GeoMapMarker[] = options.markers;
  let selectedId = options.selectedId;

  const renderMarkers = () => {
    for (const handle of markerHandles.splice(0)) {
      handle.remove();
    }
    for (const marker of markerData) {
      const handle = new maplibregl.Marker({
        color: marker.id === selectedId ? '#2563eb' : '#dc2626',
      })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);
      handle.getElement().title = marker.label ?? marker.id;
      handle.getElement().addEventListener('click', (event) => {
        event.stopPropagation();
        options.onMarkerSelect(marker);
      });
      markerHandles.push(handle);
    }
  };

  map.on('load', () => renderMarkers());

  return {
    destroy() {
      for (const handle of markerHandles) {
        handle.remove();
      }
      map.remove();
    },
    setMarkers(markers, nextSelectedId) {
      markerData = markers;
      selectedId = nextSelectedId;
      renderMarkers();
    },
    setView(view: GeoMapView) {
      map.flyTo({ center: [view.lng, view.lat], zoom: view.zoom });
    },
  };
}
