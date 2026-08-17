<script setup lang="ts">
import { DEFAULT_APP_LOCALES, GEO_MAP_PROVIDERS, MOCK_DESTINATIONS, type GeoMapProvider } from '@destination-atlas';
import BoundSelectInput from './BoundSelectInput.vue';
import { ATLAS_USER_ROLES, type AtlasUserRole } from '../lib/roles';
import { localizedDestinationName } from '../lib/atlas-utils';
import type { SettingFieldTarget } from '../lib/settings-highlight';

const props = defineProps<{
  locale: string;
  userRole: AtlasUserRole;
  mapProvider: GeoMapProvider;
  selectedId: string;
  highlightField?: SettingFieldTarget | null;
  class?: string;
}>();

const emit = defineEmits<{
  'update:locale': [string];
  'update:userRole': [AtlasUserRole];
  'update:mapProvider': [GeoMapProvider];
  'update:selectedId': [string];
}>();

const localeOptions = DEFAULT_APP_LOCALES.map((entry) => ({
  value: entry.code,
  label: entry.nativeLabel ? `${entry.label} (${entry.nativeLabel})` : entry.label,
}));

const mapOptions = GEO_MAP_PROVIDERS.map((entry) => ({ value: entry.id, label: entry.label }));

const destinationOptions = () =>
  MOCK_DESTINATIONS.map((dest) => ({
    value: dest.id,
    label: localizedDestinationName(dest, props.locale),
  }));

const fields = () => [
  {
    key: 'role' as const,
    label: 'Role',
    hint: 'Preview permissions for gated screens.',
    value: props.userRole,
    options: ATLAS_USER_ROLES.map((entry) => ({ value: entry.id, label: entry.label })),
    onChange: (value: string) => emit('update:userRole', value as AtlasUserRole),
  },
  {
    key: 'locale' as const,
    label: 'App locale',
    hint: 'Base locale for developer-owned destination labels.',
    value: props.locale,
    options: localeOptions,
    onChange: (value: string) => emit('update:locale', value),
  },
  {
    key: 'map' as const,
    label: 'Map provider',
    hint: 'Default 2D map engine for the Map screen.',
    value: props.mapProvider,
    options: mapOptions,
    onChange: (value: string) => emit('update:mapProvider', value as GeoMapProvider),
  },
  {
    key: 'selected' as const,
    label: 'Selected',
    hint: 'Active destination across tabs and URL state.',
    value: props.selectedId,
    options: destinationOptions(),
    onChange: (value: string) => emit('update:selectedId', value),
  },
];
</script>

<template>
  <div :class="['da-context-grid', $props.class].filter(Boolean)">
    <div
      v-for="field in fields()"
      :key="field.key"
      :data-setting="field.key"
      :class="['da-context-grid__cell', highlightField === field.key ? 'rd-highlight-target' : undefined].filter(Boolean)"
    >
      <BoundSelectInput
        :field-label="field.label"
        :options="field.options"
        :value="field.value"
        @update:value="field.onChange"
      />
      <p class="da-context-grid__hint">{{ field.hint }}</p>
    </div>
  </div>
</template>
