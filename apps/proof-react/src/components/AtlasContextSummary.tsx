import { DEFAULT_APP_LOCALES, GEO_MAP_PROVIDERS, MOCK_DESTINATIONS, getDestinationById, type GeoMapProvider } from '@destination-atlas';
import { roleLabel, type AtlasUserRole } from '../lib/roles';
import { localizedDestinationName } from '../lib/atlas-utils';
import { themeLabel, type ThemePreference } from '../lib/theme';
import type { SettingFieldTarget } from '../lib/settings-highlight';

export interface AtlasContextSummaryProps {
  locale: string;
  userRole: AtlasUserRole;
  mapProvider: GeoMapProvider;
  selectedId: string;
  theme: ThemePreference;
  onOpenSetting: (field: SettingFieldTarget | 'theme') => void;
}

export function AtlasContextSummary({
  locale,
  userRole,
  mapProvider,
  selectedId,
  theme,
  onOpenSetting,
}: AtlasContextSummaryProps) {
  const selected = getDestinationById(selectedId);
  const mapLabel = GEO_MAP_PROVIDERS.find((entry) => entry.id === mapProvider)?.label ?? mapProvider;
  const selectedLabel = selected ? localizedDestinationName(selected, locale) : 'None';
  const localeEntry = DEFAULT_APP_LOCALES.find((entry) => entry.code === locale);
  const localeLabel = localeEntry
    ? localeEntry.nativeLabel
      ? `${localeEntry.label} (${localeEntry.nativeLabel})`
      : localeEntry.label
    : locale;

  const chips: Array<{ key: SettingFieldTarget | 'theme'; label: string; value: string }> = [
    { key: 'role', label: 'Role', value: roleLabel(userRole) },
    { key: 'locale', label: 'App locale', value: localeLabel },
    { key: 'map', label: 'Map provider', value: mapLabel },
    { key: 'selected', label: 'Selected', value: selectedLabel },
    { key: 'theme', label: 'Theme', value: themeLabel(theme) },
  ];

  return (
    <div className="da-context-summary" role="group" aria-label="Current app context">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className="da-context-chip"
          onClick={() => onOpenSetting(chip.key)}
        >
          <span className="da-context-chip__label">{chip.label}</span>
          <strong className="da-context-chip__value">{chip.value}</strong>
        </button>
      ))}
    </div>
  );
}
