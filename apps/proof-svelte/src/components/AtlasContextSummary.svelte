<script lang="ts">
  import { DEFAULT_APP_LOCALES, GEO_MAP_PROVIDERS, getDestinationById, type GeoMapProvider } from '@destination-atlas';
  import { roleLabel, type AtlasUserRole } from '../lib/roles';
  import { localizedDestinationName } from '../lib/atlas-utils';
  import { themeLabel, type ThemePreference } from '../lib/theme-preference.svelte';
  import type { SettingFieldTarget } from '../lib/settings-highlight';

  let {
    locale,
    userRole,
    mapProvider,
    selectedId,
    theme,
    onOpenSetting,
  }: {
    locale: string;
    userRole: AtlasUserRole;
    mapProvider: GeoMapProvider;
    selectedId: string;
    theme: ThemePreference;
    onOpenSetting?: (target: SettingFieldTarget | 'theme') => void;
  } = $props();

  const selected = $derived(getDestinationById(selectedId));
  const mapLabel = $derived(
    GEO_MAP_PROVIDERS.find((entry) => entry.id === mapProvider)?.label ?? mapProvider,
  );
  const selectedLabel = $derived(
    selected ? localizedDestinationName(selected, locale) : 'None',
  );
  const localeLabel = $derived.by(() => {
    const localeEntry = DEFAULT_APP_LOCALES.find((entry) => entry.code === locale);
    if (!localeEntry) {
      return locale;
    }
    return localeEntry.nativeLabel ? `${localeEntry.label} (${localeEntry.nativeLabel})` : localeEntry.label;
  });

  const chips = $derived([
    { key: 'role' as const, label: 'Role', value: roleLabel(userRole) },
    { key: 'locale' as const, label: 'App locale', value: localeLabel },
    { key: 'map' as const, label: 'Map provider', value: mapLabel },
    { key: 'selected' as const, label: 'Selected', value: selectedLabel },
    { key: 'theme' as const, label: 'Theme', value: themeLabel(theme) },
  ]);
</script>

<div class="da-context-summary" role="group" aria-label="Current app context">
  {#each chips as chip (chip.key)}
    <button type="button" class="da-context-chip" onclick={() => onOpenSetting?.(chip.key)}>
      <span class="da-context-chip__label">{chip.label}</span>
      <strong class="da-context-chip__value">{chip.value}</strong>
    </button>
  {/each}
</div>
