<script lang="ts">
  import { DEFAULT_APP_LOCALES, GEO_MAP_PROVIDERS, MOCK_DESTINATIONS, type GeoMapProvider } from '@destination-atlas';
  import BoundSelectInput from './BoundSelectInput.svelte';
  import { ATLAS_USER_ROLES, type AtlasUserRole } from '../lib/roles';
  import { localizedDestinationName } from '../lib/atlas-utils';
  import type { SettingFieldTarget } from '../lib/settings-highlight';

  let {
    locale,
    userRole,
    mapProvider,
    selectedId,
    highlightField = null,
    class: className,
    onLocaleChange,
    onUserRoleChange,
    onMapProviderChange,
    onSelectedIdChange,
  }: {
    locale: string;
    userRole: AtlasUserRole;
    mapProvider: GeoMapProvider;
    selectedId: string;
    highlightField?: SettingFieldTarget | null;
    class?: string;
    onLocaleChange?: (locale: string) => void;
    onUserRoleChange?: (role: AtlasUserRole) => void;
    onMapProviderChange?: (provider: GeoMapProvider) => void;
    onSelectedIdChange?: (id: string) => void;
  } = $props();

  const localeOptions = DEFAULT_APP_LOCALES.map((entry) => ({
    value: entry.code,
    label: entry.nativeLabel ? `${entry.label} (${entry.nativeLabel})` : entry.label,
  }));

  const mapOptions = GEO_MAP_PROVIDERS.map((entry) => ({ value: entry.id, label: entry.label }));

  const destinationOptions = $derived(
    MOCK_DESTINATIONS.map((dest) => ({
      value: dest.id,
      label: localizedDestinationName(dest, locale),
    })),
  );

  const fields = $derived([
    {
      key: 'role' as const,
      label: 'Role',
      hint: 'Preview permissions for gated screens.',
      value: userRole,
      options: ATLAS_USER_ROLES.map((entry) => ({ value: entry.id, label: entry.label })),
      onChange: (value: string) => onUserRoleChange?.(value as AtlasUserRole),
    },
    {
      key: 'locale' as const,
      label: 'App locale',
      hint: 'Base locale for developer-owned destination labels.',
      value: locale,
      options: localeOptions,
      onChange: (value: string) => onLocaleChange?.(value),
    },
    {
      key: 'map' as const,
      label: 'Map provider',
      hint: 'Default 2D map engine for the Map screen.',
      value: mapProvider,
      options: mapOptions,
      onChange: (value: string) => onMapProviderChange?.(value as GeoMapProvider),
    },
    {
      key: 'selected' as const,
      label: 'Selected',
      hint: 'Active destination across tabs and URL state.',
      value: selectedId,
      options: destinationOptions,
      onChange: (value: string) => onSelectedIdChange?.(value),
    },
  ]);
</script>

<div class={['da-context-grid', className].filter(Boolean).join(' ')}>
  {#each fields as field (field.key)}
    <div
      data-setting={field.key}
      class={['da-context-grid__cell', highlightField === field.key ? 'rd-highlight-target' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <BoundSelectInput
        fieldLabel={field.label}
        options={field.options}
        value={field.value}
        onValueChange={field.onChange}
      />
      <p class="da-context-grid__hint">{field.hint}</p>
    </div>
  {/each}
</div>
