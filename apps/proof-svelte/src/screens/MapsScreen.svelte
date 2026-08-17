<script module lang="ts">
  export const MAPS_SOURCE = `<MapsScreen mapsPanel={mapsPanel}>
  <MapScreen part="toolbar" />
  <MapsPanelNav panel={mapsPanel} />
  <MapScreen v-if="map" /> | <GlobeScreen v-else />
</MapsScreen>`;
</script>

<script lang="ts">
  import type { GeoMapProvider } from '@destination-atlas';
  import MapsPanelNav from '../components/MapsPanelNav.svelte';
  import BoundSelectInput from '../components/BoundSelectInput.svelte';
  import MapScreen from './MapScreen.svelte';
  import GlobeScreen from './GlobeScreen.svelte';
  import type { GeoExplorerListPlacement } from '../components/GeoExplorerLayout.svelte';

  let {
    locale,
    selectedId,
    mapProvider,
    mapLocationQuery,
    mapViewOverride,
    mapsPanel,
    onSelectedIdChange,
    onMapProviderChange,
    onMapLocationQueryChange,
    onMapsPanelChange,
    onFocusDestinationOnMap,
    onGoToMapView,
    onOpenSettings,
  }: {
    locale: string;
    selectedId: string;
    mapProvider: GeoMapProvider;
    mapLocationQuery: string;
    mapViewOverride: { lat: number; lng: number; zoom: number; label: string } | null;
    mapsPanel: 'map' | 'globe';
    onSelectedIdChange?: (id: string) => void;
    onMapProviderChange?: (provider: GeoMapProvider) => void;
    onMapLocationQueryChange?: (query: string) => void;
    onMapsPanelChange?: (panel: 'map' | 'globe') => void;
    onFocusDestinationOnMap?: (id: string) => void;
    onGoToMapView?: (view: { lat: number; lng: number; zoom: number; label: string }) => void;
    onOpenSettings?: () => void;
  } = $props();

  let listPlacement = $state<GeoExplorerListPlacement>('right');
</script>

<section class="da-panel da-maps-panel da-maps-panel--{mapsPanel}">
  <div class="da-maps-panel__body">
    <div class="da-maps-toolbar">
      <MapScreen
        part="toolbar"
        embedded
        {locale}
        {selectedId}
        {mapProvider}
        {mapLocationQuery}
        {mapViewOverride}
        onSelectedIdChange={onSelectedIdChange}
        onMapProviderChange={onMapProviderChange}
        onMapLocationQueryChange={onMapLocationQueryChange}
        {onFocusDestinationOnMap}
        {onGoToMapView}
        {onOpenSettings}
      />
      <BoundSelectInput
        fieldLabel="Destination list placement"
        options={[
          { value: 'right', label: 'List on right' },
          { value: 'left', label: 'List on left' },
        ]}
        value={listPlacement}
        onValueChange={(value) => (listPlacement = value as GeoExplorerListPlacement)}
      />
    </div>

    <MapsPanelNav panel={mapsPanel} onSelectPanel={onMapsPanelChange} />

    <div class="da-maps-explorer">
      {#if mapsPanel === 'map'}
        <MapScreen
          part="explorer"
          embedded
          {listPlacement}
          {locale}
          {selectedId}
          {mapProvider}
          {mapLocationQuery}
          {mapViewOverride}
          onSelectedIdChange={onSelectedIdChange}
          onMapProviderChange={onMapProviderChange}
          onMapLocationQueryChange={onMapLocationQueryChange}
          {onFocusDestinationOnMap}
          {onGoToMapView}
          {onOpenSettings}
        />
      {:else}
        <GlobeScreen
          part="explorer"
          embedded
          {listPlacement}
          {locale}
          {selectedId}
          onSelectedIdChange={onSelectedIdChange}
          {onFocusDestinationOnMap}
        />
      {/if}
    </div>

    {#if mapsPanel === 'globe'}
      <GlobeScreen
        part="footer"
        embedded
        {locale}
        {selectedId}
        onSelectedIdChange={onSelectedIdChange}
        {onFocusDestinationOnMap}
      />
    {/if}
  </div>
</section>
