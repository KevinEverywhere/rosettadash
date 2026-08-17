<script lang="ts">
export const GLOBE_SOURCE = `<GlobeScreen part="explorer" locale={locale} selectedId={selectedId}>
  <GeoExplorerLayout items={…} selectedId={selectedId} />
  <ReactMount component={GlobeThree} textureUrl markers selectedId />
</GlobeScreen>`;
</script>

<script setup lang="ts">
import { computed, markRaw } from 'vue';
import {
  DEFAULT_WORLD_EQUIRECT_ATTRIBUTION,
  DEFAULT_WORLD_EQUIRECT_URL,
  GLOBE_TEXTURE_SOURCE_OPTIONS,
  MOCK_DESTINATIONS,
} from '@destination-atlas';
import GeoExplorerLayout, { type GeoExplorerListPlacement } from '../components/GeoExplorerLayout.vue';
import ReactMount from '../components/ReactMount.vue';
import { GlobeThree } from '../globe/GlobeThree';
import { formatRegionLabel, localizedDestinationName } from '../lib/atlas-utils';

const props = withDefaults(
  defineProps<{
    locale: string;
    selectedId: string;
    embedded?: boolean;
    part?: 'explorer' | 'footer';
    listPlacement?: GeoExplorerListPlacement;
  }>(),
  { embedded: false, listPlacement: 'right' },
);

const emit = defineEmits<{
  'update:selectedId': [string];
  focusDestinationOnMap: [string];
}>();

const markers = computed(() =>
  MOCK_DESTINATIONS.map((dest) => ({
    id: dest.id,
    lat: dest.lat,
    lng: dest.lng,
    label: localizedDestinationName(dest, props.locale),
  })),
);

const listItems = computed(() =>
  MOCK_DESTINATIONS.map((dest) => ({
    id: dest.id,
    label: localizedDestinationName(dest, props.locale),
    meta: formatRegionLabel(dest.region),
  })),
);

function selectFromList(id: string) {
  emit('update:selectedId', id);
}

function selectFromGlobe(id: string) {
  if (id === props.selectedId) {
    emit('focusDestinationOnMap', id);
    return;
  }
  emit('update:selectedId', id);
}

const globeMountProps = computed(() =>
  markRaw({
    textureUrl: DEFAULT_WORLD_EQUIRECT_URL,
    markers: markers.value,
    selectedId: props.selectedId,
    onMarkerSelect: selectFromGlobe,
  }),
);
</script>

<template>
  <GeoExplorerLayout
    v-if="!embedded || part === 'explorer'"
    :list-placement="listPlacement"
    :items="listItems"
    :selected-id="selectedId"
    @select="selectFromList"
  >
    <div class="da-globe-stage">
      <ReactMount
        :key="selectedId"
        :component="GlobeThree"
        :component-props="globeMountProps"
      />
    </div>
  </GeoExplorerLayout>

  <div v-if="embedded && part === 'footer'" class="da-maps-footer">
    <p class="da-note">{{ DEFAULT_WORLD_EQUIRECT_ATTRIBUTION }}</p>
    <details class="da-globe-sources">
      <summary>Future globe texture sources</summary>
      <ul>
        <li v-for="source in GLOBE_TEXTURE_SOURCE_OPTIONS" :key="source.id">
          <strong>{{ source.label }}</strong> — {{ source.license }}. {{ source.notes }}
          <span v-if="source.apiKeyRequired"> API key required.</span>
        </li>
      </ul>
    </details>
  </div>
</template>
