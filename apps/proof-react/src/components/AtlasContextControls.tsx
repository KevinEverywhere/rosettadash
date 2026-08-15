import { DEFAULT_APP_LOCALES, GEO_MAP_PROVIDERS, MOCK_DESTINATIONS, type GeoMapProvider } from '@destination-atlas';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import { ATLAS_USER_ROLES, type AtlasUserRole } from '../lib/roles';
import { localizedDestinationName } from '../lib/atlas-utils';
import type { SettingFieldTarget } from '../lib/settings-highlight';

export interface AtlasContextControlsProps {
  locale: string;
  setLocale: (locale: string) => void;
  userRole: AtlasUserRole;
  setUserRole: (role: AtlasUserRole) => void;
  mapProvider: GeoMapProvider;
  setMapProvider: (provider: GeoMapProvider) => void;
  selectedId: string;
  setSelectedId: (id: string) => void;
  highlightField?: SettingFieldTarget | null;
  className?: string;
}

const ROLE_HINT = 'Preview permissions for gated screens.';
const LOCALE_HINT = 'Base locale for developer-owned destination labels.';
const MAP_HINT = 'Default 2D map engine for the Map screen.';
const SELECTED_HINT = 'Active destination across tabs and URL state.';

export function AtlasContextControls({
  locale,
  setLocale,
  userRole,
  setUserRole,
  mapProvider,
  setMapProvider,
  selectedId,
  setSelectedId,
  highlightField,
  className,
}: AtlasContextControlsProps) {
  const rootClass = ['da-context-grid', className].filter(Boolean).join(' ');

  const localeOptions = DEFAULT_APP_LOCALES.map((entry) => ({
    value: entry.code,
    label: entry.nativeLabel ? `${entry.label} (${entry.nativeLabel})` : entry.label,
  }));

  const mapOptions = GEO_MAP_PROVIDERS.map((entry) => ({
    value: entry.id,
    label: entry.label,
  }));

  const destinationOptions = MOCK_DESTINATIONS.map((dest) => ({
    value: dest.id,
    label: localizedDestinationName(dest, locale),
  }));

  const fields: Array<{
    key: SettingFieldTarget;
    label: string;
    hint: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  }> = [
    {
      key: 'role',
      label: 'Role',
      hint: ROLE_HINT,
      value: userRole,
      options: ATLAS_USER_ROLES.map((entry) => ({ value: entry.id, label: entry.label })),
      onChange: (value: string) => setUserRole(value as AtlasUserRole),
    },
    {
      key: 'locale',
      label: 'App locale',
      hint: LOCALE_HINT,
      value: locale,
      options: localeOptions,
      onChange: setLocale,
    },
    {
      key: 'map',
      label: 'Map provider',
      hint: MAP_HINT,
      value: mapProvider,
      options: mapOptions,
      onChange: (value: string) => setMapProvider(value as GeoMapProvider),
    },
    {
      key: 'selected',
      label: 'Selected',
      hint: SELECTED_HINT,
      value: selectedId,
      options: destinationOptions,
      onChange: setSelectedId,
    },
  ];

  return (
    <div className={rootClass}>
      {fields.map((field) => (
        <div
          key={field.key}
          data-setting={field.key}
          className={[
            'da-context-grid__cell',
            highlightField === field.key ? 'rd-highlight-target' : undefined,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <SelectInput
            label={field.label}
            options={field.options}
            value={field.value}
            onChange={field.onChange}
          />
          <p className="da-context-grid__hint">{field.hint}</p>
        </div>
      ))}
    </div>
  );
}
