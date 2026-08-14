import type { GeoMapAdapter } from '../geo-map-types.js';

/** Inject a provider stylesheet into the shadow root (once per id). */
export async function injectStylesheet(
  root: ShadowRoot,
  id: string,
  href: string,
): Promise<void> {
  if (root.querySelector(`#${id}`)) {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
    root.appendChild(link);
  });
}

export const PROVIDER_STYLESHEETS = {
  maplibre: 'https://unpkg.com/maplibre-gl@6.3.0/dist/maplibre-gl.css',
  leaflet: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
} as const;

const NOOP_GEO_MAP_ADAPTER: GeoMapAdapter = {
  destroy: () => undefined,
  setMarkers: () => undefined,
  setView: () => undefined,
};

export function createNoopAdapter(): GeoMapAdapter {
  return NOOP_GEO_MAP_ADAPTER;
}
