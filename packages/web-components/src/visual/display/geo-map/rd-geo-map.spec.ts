import { parseGeoMapCenter } from './parse-center.js';
import { parseGeoMapMarkers } from './parse-markers.js';
import type { GeoMapMarker } from './geo-map-types.js';
import {
  DB_GEO_MAP_TAG,
  RdGeoMapElement,
  registerRdGeoMap,
} from './rd-geo-map.js';

describe('parseGeoMapMarkers', () => {
  it('parses valid marker rowsets', () => {
    expect(
      parseGeoMapMarkers(
        JSON.stringify([
          { id: 'paris', lat: 48.8566, lng: 2.3522, label: 'Paris' },
          { id: 'bad', lat: 'x', lng: 2 },
        ]),
      ),
    ).toEqual([{ id: 'paris', lat: 48.8566, lng: 2.3522, label: 'Paris' }]);
  });
});

describe('parseGeoMapCenter', () => {
  it('parses JSON center', () => {
    expect(parseGeoMapCenter('{"lat":10,"lng":20}')).toEqual({ lat: 10, lng: 20 });
  });

  it('parses comma-separated center', () => {
    expect(parseGeoMapCenter('10,20')).toEqual({ lat: 10, lng: 20 });
  });
});

describe('rd-geo-map', () => {
  beforeAll(() => {
    registerRdGeoMap();
  });

  it('registers the custom element', () => {
    expect(customElements.get(DB_GEO_MAP_TAG)).toBe(RdGeoMapElement);
  });

  it('shows google maps error without api key', async () => {
    const el = document.createElement(DB_GEO_MAP_TAG) as RdGeoMapElement;
    el.setAttribute('provider', 'google-maps');
    document.body.appendChild(el);
    await el.whenMapReady();

    const error = el.shadowRoot?.querySelector('[data-ref="error"]');
    expect(error?.textContent).toContain('api-key');

    el.remove();
  });

  it('dispatches marker-select and updates selected-id', async () => {
    const el = document.createElement(DB_GEO_MAP_TAG) as RdGeoMapElement;
    const handler = jest.fn();
    el.addEventListener('marker-select', handler);
    document.body.appendChild(el);
    el.setAttribute(
      'markers',
      JSON.stringify([{ id: 'tokyo', lat: 35.6762, lng: 139.6503 }]),
    );
    await el.whenReady();

    const marker: GeoMapMarker = { id: 'tokyo', lat: 35.6762, lng: 139.6503 };
    (
      el as unknown as { handleMarkerSelect: (next: GeoMapMarker) => void }
    ).handleMarkerSelect(marker);

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { id: 'tokyo', lat: 35.6762, lng: 139.6503 },
      }),
    );
    expect(el.getAttribute('selected-id')).toBe('tokyo');

    el.remove();
  });
});
