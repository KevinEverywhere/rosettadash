<script setup lang="ts">
import { DEFAULT_APP_LOCALES, GEO_MAP_PROVIDERS, MOCK_DESTINATIONS, getDestinationById, type GeoMapProvider } from '@destination-atlas';
import { roleLabel, type AtlasUserRole } from '../lib/roles';
import { localizedDestinationName } from '../lib/atlas-utils';
import { themeLabel, type ThemePreference } from '../composables/use-theme-preference';
import type { SettingFieldTarget } from '../lib/settings-highlight';

const props = defineProps<{
  locale: string;
  userRole: AtlasUserRole;
  mapProvider: GeoMapProvider;
  selectedId: string;
  theme: ThemePreference;
}>();

const emit = defineEmits<{
  openSetting: [SettingFieldTarget | 'theme'];
}>();

const selected = () => getDestinationById(props.selectedId);
const mapLabel = () => GEO_MAP_PROVIDERS.find((entry) => entry.id === props.mapProvider)?.label ?? props.mapProvider;
const selectedLabel = () => {
  const dest = selected();
  return dest ? localizedDestinationName(dest, props.locale) : 'None';
};
const localeLabel = () => {
  const localeEntry = DEFAULT_APP_LOCALES.find((entry) => entry.code === props.locale);
  if (!localeEntry) {
    return props.locale;
  }
  return localeEntry.nativeLabel ? `${localeEntry.label} (${localeEntry.nativeLabel})` : localeEntry.label;
};

const chips = () => [
  { key: 'role' as const, label: 'Role', value: roleLabel(props.userRole) },
  { key: 'locale' as const, label: 'App locale', value: localeLabel() },
  { key: 'map' as const, label: 'Map provider', value: mapLabel() },
  { key: 'selected' as const, label: 'Selected', value: selectedLabel() },
  { key: 'theme' as const, label: 'Theme', value: themeLabel(props.theme) },
];
</script>

<template>
  <div class="da-context-summary" role="group" aria-label="Current app context">
    <button
      v-for="chip in chips()"
      :key="chip.key"
      type="button"
      class="da-context-chip"
      @click="emit('openSetting', chip.key)"
    >
      <span class="da-context-chip__label">{{ chip.label }}</span>
      <strong class="da-context-chip__value">{{ chip.value }}</strong>
    </button>
  </div>
</template>
