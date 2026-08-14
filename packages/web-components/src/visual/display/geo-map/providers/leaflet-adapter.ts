import type { GeoMapAdapter, GeoMapAdapterOptions, GeoMapMarker, GeoMapView } from '../geo-map-types.js';
import { DEFAULT_LEAFLET_TILE_URL } from '../geo-map-types.js';
import { createNoopAdapter, injectStylesheet, PROVIDER_STYLESHEETS } from './provider-utils.js';

type LeafletMap = {
  remove: () => void;
  setView: (center: [number, number], zoom: number) => LeafletMap;
  invalidateSize: () => void;
};

type LeafletLayer = {
  addTo: (map: LeafletMap) => LeafletLayer;
  remove: () => void;
  on: (event: string, handler: () => void) => LeafletLayer;
};

type LeafletModule = {
  map: (element: HTMLElement, options?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options?: Record<string, unknown>) => LeafletLayer;
  circleMarker: (
    latlng: [number, number],
    options?: Record<string, unknown>,
  ) => LeafletLayer;
};

export async function createLeafletAdapter(
  options: GeoMapAdapterOptions,
): Promise<GeoMapAdapter> {
  const shadowRoot = options.container.getRootNode() as ShadowRoot;
  if (!(shadowRoot instanceof ShadowRoot)) {
    options.onError('Geo map container must live inside a shadow root.');
    return createNoopAdapter();
  }

  let L: LeafletModule;
  try {
    L = (await import('leaflet')).default as unknown as LeafletModule;
  } catch {
    options.onError('leaflet is not installed. Add it as a dependency in your app.');
    return createNoopAdapter();
  }

  try {
    await injectStylesheet(shadowRoot, 'rd-geo-map-leaflet-css', PROVIDER_STYLESHEETS.leaflet);
  } catch {
    options.onError('Failed to load Leaflet stylesheet.');
    return createNoopAdapter();
  }

  const container = options.container;
  if ((container as HTMLElement & { _leaflet_id?: number })._leaflet_id != null) {
    container.replaceChildren();
    delete (container as HTMLElement & { _leaflet_id?: number })._leaflet_id;
  }

  const map = L.map(container, {
    zoomControl: true,
    attributionControl: true,
  }).setView([options.view.lat, options.view.lng], options.view.zoom);

  const tileLayer = L.tileLayer(options.tileUrl || DEFAULT_LEAFLET_TILE_URL, {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  });
  tileLayer.addTo(map);

  const markerLayers: LeafletLayer[] = [];
  let markerData: GeoMapMarker[] = options.markers;
  let selectedId = options.selectedId;

  const renderMarkers = () => {
    for (const layer of markerLayers.splice(0)) {
      layer.remove();
    }
    for (const marker of markerData) {
      const layer = L.circleMarker([marker.lat, marker.lng], {
        radius: marker.id === selectedId ? 10 : 8,
        color: marker.id === selectedId ? '#2563eb' : '#dc2626',
        fillColor: marker.id === selectedId ? '#2563eb' : '#dc2626',
        fillOpacity: 0.85,
        weight: 2,
      });
      layer.on('click', () => options.onMarkerSelect(marker));
      layer.addTo(map);
      markerLayers.push(layer);
    }
  };

  renderMarkers();
  requestAnimationFrame(() => map.invalidateSize());

  return {
    destroy() {
      for (const layer of markerLayers) {
        layer.remove();
      }
      map.remove();
      delete (container as HTMLElement & { _leaflet_id?: number })._leaflet_id;
    },
    setMarkers(markers, nextSelectedId) {
      markerData = markers;
      selectedId = nextSelectedId;
      renderMarkers();
    },
    setView(view: GeoMapView) {
      map.setView([view.lat, view.lng], view.zoom);
    },
  };
}
