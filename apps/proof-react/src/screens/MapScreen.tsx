import { TabsLayout } from '@rosettadash/react/layout/tabs';
import { GeoMap } from '@rosettadash/react/visual/display/geo-map';
import { LinkList } from '@rosettadash/react/visual/link-list';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import { GEO_MAP_PROVIDERS, MOCK_DESTINATIONS, getDestinationById, type GeoMapProvider } from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { localizedDestinationName } from '../lib/atlas-utils';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

type Props = Pick<
  AtlasContext,
  'locale' | 'selectedId' | 'setSelectedId' | 'mapProvider' | 'setMapProvider' | 'mapTabId' | 'setMapTabId'
>;

export function MapScreen({
  locale,
  selectedId,
  setSelectedId,
  mapProvider,
  setMapProvider,
  mapTabId,
  setMapTabId,
}: Props) {
  const selected = getDestinationById(selectedId);
  const view = selected
    ? { lat: selected.lat, lng: selected.lng, zoom: 5 }
    : { lat: 20, lng: 0, zoom: 2 };

  const markers = MOCK_DESTINATIONS.map((dest) => ({
    id: dest.id,
    lat: dest.lat,
    lng: dest.lng,
    label: localizedDestinationName(dest, locale),
  }));

  const activeProvider = GEO_MAP_PROVIDERS.find((entry) => entry.id === mapProvider);

  return (
    <section className="da-panel">
      <h2>Map</h2>
      <p>2D exploration with developer-selectable geo-map provider.</p>
      <SelectInput
        label="Map provider"
        options={GEO_MAP_PROVIDERS.map((entry) => ({
          value: entry.id,
          label: entry.label,
        }))}
        value={mapProvider}
        onChange={(value) => setMapProvider(value as GeoMapProvider)}
      />
      {activeProvider ? (
        <dl className="da-provider-meta">
          <dt>Cost</dt>
          <dd>{activeProvider.costSummary}</dd>
          <dt>API key</dt>
          <dd>{activeProvider.apiKeyRequired ? 'Required' : 'Optional'}</dd>
          <dt>Notes</dt>
          <dd>{activeProvider.notes}</dd>
        </dl>
      ) : null}
      {mapProvider === 'google-maps' && !GOOGLE_MAPS_API_KEY ? (
        <p className="da-note">
          Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env.local</code> to load Google Maps.
        </p>
      ) : null}
      <TabsLayout
        title="Explore"
        tabs={[
          { id: 'map', label: 'Map' },
          { id: 'list', label: 'Destinations' },
        ]}
        activeTabId={mapTabId}
        onTabChange={(tabId) => setMapTabId(tabId as 'map' | 'list')}
      >
        {mapTabId === 'map' ? (
          <GeoMap
            className="da-geo-map"
            provider={mapProvider}
            center={JSON.stringify({ lat: view.lat, lng: view.lng })}
            zoom={view.zoom}
            markers={markers}
            selectedId={selectedId}
            apiKey={mapProvider === 'google-maps' ? GOOGLE_MAPS_API_KEY : undefined}
            onMarkerSelect={({ id }) => setSelectedId(id)}
          />
        ) : (
          <LinkList
            dense
            items={MOCK_DESTINATIONS.map((dest) => ({
              label: localizedDestinationName(dest, locale),
              href: `#${dest.id}`,
            }))}
          />
        )}
      </TabsLayout>
      <p className="da-note">
        Selected destination: <strong>{selected ? localizedDestinationName(selected, locale) : 'none'}</strong>
      </p>
    </section>
  );
}
