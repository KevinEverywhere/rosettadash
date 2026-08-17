<script lang="ts">
export const MAPS_SOURCE = `<MapsScreen mapsPanel={mapsPanel}>
  <MapScreen part="toolbar" />
  <MapsPanelNav panel={mapsPanel} />
  <MapScreen v-if="map" /> | <GlobeScreen v-else />
</MapsScreen>`;
</script>

<script setup lang="ts">
import { ref } from 'vue';
import type { GeoMapProvider } from '@destination-atlas';
import MapsPanelNav from '../components/MapsPanelNav.vue';
import BoundSelectInput from '../components/BoundSelectInput.vue';
import MapScreen from './MapScreen.vue';
import GlobeScreen from './GlobeScreen.vue';
import type { GeoExplorerListPlacement } from '../components/GeoExplorerLayout.vue';

defineProps<{
  locale: string;
  selectedId: string;
  mapProvider: GeoMapProvider;
  mapLocationQuery: string;
  mapViewOverride: { lat: number; lng: number; zoom: number; label: string } | null;
  mapsPanel: 'map' | 'globe';
}>();

const emit = defineEmits<{
  'update:selectedId': [string];
  'update:mapProvider': [GeoMapProvider];
  'update:mapLocationQuery': [string];
  'update:mapsPanel': ['map' | 'globe'];
  focusDestinationOnMap: [string];
  goToMapView: [{ lat: number; lng: number; zoom: number; label: string }];
  openSettings: [];
}>();

const listPlacement = ref<GeoExplorerListPlacement>('right');
</script>

<template>
  <section class="da-panel da-maps-panel" :class="`da-maps-panel--${mapsPanel}`">
    <div class="da-maps-panel__body">
      <div class="da-maps-toolbar">
        <MapScreen
          part="toolbar"
          embedded
          :locale="locale"
          :selected-id="selectedId"
          :map-provider="mapProvider"
          :map-location-query="mapLocationQuery"
          :map-view-override="mapViewOverride"
          @update:selected-id="emit('update:selectedId', $event)"
          @update:map-provider="emit('update:mapProvider', $event)"
          @update:map-location-query="emit('update:mapLocationQuery', $event)"
          @focus-destination-on-map="emit('focusDestinationOnMap', $event)"
          @go-to-map-view="emit('goToMapView', $event)"
          @open-settings="emit('openSettings')"
        />
        <BoundSelectInput
          field-label="Destination list placement"
          :options="[
            { value: 'right', label: 'List on right' },
            { value: 'left', label: 'List on left' },
          ]"
          :value="listPlacement"
          @update:value="listPlacement = $event as GeoExplorerListPlacement"
        />
      </div>

      <MapsPanelNav :panel="mapsPanel" @select-panel="emit('update:mapsPanel', $event)" />

      <div class="da-maps-explorer">
        <MapScreen
          v-if="mapsPanel === 'map'"
          part="explorer"
          embedded
          :list-placement="listPlacement"
          :locale="locale"
          :selected-id="selectedId"
          :map-provider="mapProvider"
          :map-location-query="mapLocationQuery"
          :map-view-override="mapViewOverride"
          @update:selected-id="emit('update:selectedId', $event)"
          @update:map-provider="emit('update:mapProvider', $event)"
          @update:map-location-query="emit('update:mapLocationQuery', $event)"
          @focus-destination-on-map="emit('focusDestinationOnMap', $event)"
          @go-to-map-view="emit('goToMapView', $event)"
          @open-settings="emit('openSettings')"
        />
        <GlobeScreen
          v-else
          part="explorer"
          embedded
          :list-placement="listPlacement"
          :locale="locale"
          :selected-id="selectedId"
          @update:selected-id="emit('update:selectedId', $event)"
          @focus-destination-on-map="emit('focusDestinationOnMap', $event)"
        />
      </div>

      <GlobeScreen
        v-if="mapsPanel === 'globe'"
        part="footer"
        embedded
        :locale="locale"
        :selected-id="selectedId"
        @update:selected-id="emit('update:selectedId', $event)"
        @focus-destination-on-map="emit('focusDestinationOnMap', $event)"
      />
    </div>
  </section>
</template>
