<script module lang="ts">
  export const MAP_SOURCE = `<MapScreen part="toolbar|explorer" mapProvider={mapProvider} selectedId={selectedId}>
  <GeoMap provider={mapProvider} markers={…} />
</MapScreen>`;
</script>

<script lang="ts">
  import GeoMap from '@rosettadash/svelte/visual/display/geo-map';
  import { GEO_MAP_PROVIDERS, MOCK_DESTINATIONS, getDestinationById, type GeoMapProvider } from '@destination-atlas';
  import GeoExplorerLayout, { type GeoExplorerListPlacement } from '../components/GeoExplorerLayout.svelte';
  import BoundSelectInput from '../components/BoundSelectInput.svelte';
  import BoundTextInput from '../components/BoundTextInput.svelte';
  import { useConsumerSecrets } from '../lib/consumer-secrets.svelte';
  import { formatRegionLabel, localizedDestinationName } from '../lib/atlas-utils';
  import { destinationMapView, resolveMapLocationQuery } from '../lib/map-location';

  let {
    locale,
    selectedId,
    mapProvider,
    mapLocationQuery,
    mapViewOverride,
    embedded = false,
    part,
    listPlacement = 'right',
    onSelectedIdChange,
    onMapProviderChange,
    onMapLocationQueryChange,
    onFocusDestinationOnMap,
    onGoToMapView,
    onOpenSettings,
  }: {
    locale: string;
    selectedId: string;
    mapProvider: GeoMapProvider;
    mapLocationQuery: string;
    mapViewOverride: { lat: number; lng: number; zoom: number; label: string } | null;
    embedded?: boolean;
    part?: 'toolbar' | 'explorer';
    listPlacement?: GeoExplorerListPlacement;
    onSelectedIdChange?: (id: string) => void;
    onMapProviderChange?: (provider: GeoMapProvider) => void;
    onMapLocationQueryChange?: (query: string) => void;
    onFocusDestinationOnMap?: (id: string) => void;
    onGoToMapView?: (view: { lat: number; lng: number; zoom: number; label: string }) => void;
    onOpenSettings?: () => void;
  } = $props();

  const secrets = useConsumerSecrets();
  let locationError = $state('');

  const showToolbar = $derived(!embedded || part === 'toolbar');
  const showExplorer = $derived(!embedded || part === 'explorer');

  const view = $derived.by(() => {
    if (mapViewOverride) {
      return mapViewOverride;
    }
    const selected = getDestinationById(selectedId);
    return selected
      ? destinationMapView(selected, locale)
      : { lat: 20, lng: 0, zoom: 2, label: 'World' };
  });

  const centerJson = $derived(JSON.stringify({ lat: view.lat, lng: view.lng }));

  const markers = $derived(
    MOCK_DESTINATIONS.map((dest) => ({
      id: dest.id,
      lat: dest.lat,
      lng: dest.lng,
      label: localizedDestinationName(dest, locale),
    })),
  );

  const listItems = $derived(
    MOCK_DESTINATIONS.map((dest) => ({
      id: dest.id,
      label: localizedDestinationName(dest, locale),
      meta: formatRegionLabel(dest.region),
    })),
  );

  const activeProvider = $derived(GEO_MAP_PROVIDERS.find((entry) => entry.id === mapProvider));

  function submitLocation() {
    const resolved = resolveMapLocationQuery(mapLocationQuery, locale);
    if (!resolved) {
      locationError =
        'No match — try a dataset destination (Tokyo, Paris, New York City…) or lat, lng (40.71, -74.01).';
      return;
    }
    locationError = '';
    const matched = MOCK_DESTINATIONS.find(
      (dest) => localizedDestinationName(dest, locale).toLowerCase() === resolved.label.toLowerCase(),
    );
    if (matched) {
      onFocusDestinationOnMap?.(matched.id);
      return;
    }
    onGoToMapView?.(resolved);
  }

  function selectDestination(id: string) {
    onSelectedIdChange?.(id);
  }
</script>

{#if showToolbar}
  <div class="da-maps-toolbar__map-fields">
    <div class="rd-map-location">
      <BoundTextInput
        fieldLabel="Request location"
        placeholder="Destination name or lat, lng…"
        value={mapLocationQuery}
        onValueChange={(value) => onMapLocationQueryChange?.(value)}
      />
      <button type="button" class="rd-button" onclick={submitLocation}>Go to location</button>
    </div>
    {#if locationError}<p class="da-map-location-error">{locationError}</p>{/if}
    {#if view.label}
      <p class="da-note da-maps-toolbar__view-label">
        Map view: <strong>{view.label}</strong>
        {#if mapViewOverride}<span> (custom coordinates)</span>{/if}
      </p>
    {/if}

    <BoundSelectInput
      fieldLabel="Map provider"
      options={GEO_MAP_PROVIDERS.map((entry) => ({ value: entry.id, label: entry.label }))}
      value={mapProvider}
      onValueChange={(value) => onMapProviderChange?.(value as GeoMapProvider)}
    />
    {#if activeProvider}
      <dl class="da-provider-meta">
        <dt>Cost</dt>
        <dd>{activeProvider.costSummary}</dd>
        <dt>API key</dt>
        <dd>{activeProvider.apiKeyRequired ? 'Required' : 'Optional'}</dd>
        <dt>Notes</dt>
        <dd>{activeProvider.notes}</dd>
      </dl>
    {/if}
    {#if mapProvider === 'google-maps' && !secrets.googleMapsApiKey}
      <p class="da-note da-byok-cta">
        Google Maps requires an API key.
        <button type="button" class="da-locale-link" onclick={() => onOpenSettings?.()}>Configure in Settings → Integrations</button>
      </p>
    {/if}
  </div>
{/if}

{#if showExplorer}
  <GeoExplorerLayout {listPlacement} items={listItems} {selectedId} onSelect={selectDestination}>
    <div class="da-map-stage">
      <GeoMap
        className="da-map-stage__map"
        provider={mapProvider}
        center={centerJson}
        zoom={view.zoom}
        {markers}
        {selectedId}
        apiKey={mapProvider === 'google-maps' ? secrets.googleMapsApiKey : undefined}
        tileUrl={mapProvider === 'maplibre' ? secrets.maplibreTileUrl : undefined}
        onMarkerSelect={(detail) => selectDestination(detail.id)}
      />
    </div>
  </GeoExplorerLayout>
{/if}
