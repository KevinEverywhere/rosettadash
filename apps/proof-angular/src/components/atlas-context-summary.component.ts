import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import {
  DEFAULT_APP_LOCALES,
  GEO_MAP_PROVIDERS,
  MOCK_DESTINATIONS,
  getDestinationById,
  type GeoMapProvider,
} from '@destination-atlas';
import { roleLabel, type AtlasUserRole } from '../lib/roles';
import { localizedDestinationName } from '../lib/atlas-utils';
import { themeLabel, type ThemePreference } from '../services/theme.service';
import type { SettingFieldTarget } from '../lib/settings-highlight';

@Component({
  selector: 'da-atlas-context-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="da-context-summary" role="group" aria-label="Current app context">
      @for (chip of chips(); track chip.key) {
        <button type="button" class="da-context-chip" (click)="openSetting.emit(chip.key)">
          <span class="da-context-chip__label">{{ chip.label }}</span>
          <strong class="da-context-chip__value">{{ chip.value }}</strong>
        </button>
      }
    </div>
  `,
})
export class AtlasContextSummaryComponent {
  readonly locale = input.required<string>();
  readonly userRole = input.required<AtlasUserRole>();
  readonly mapProvider = input.required<GeoMapProvider>();
  readonly selectedId = input.required<string>();
  readonly theme = input.required<ThemePreference>();
  readonly openSetting = output<SettingFieldTarget | 'theme'>();

  readonly chips = computed(() => {
    const locale = this.locale();
    const selected = getDestinationById(this.selectedId());
    const mapProvider = this.mapProvider();
    const mapLabel = GEO_MAP_PROVIDERS.find((entry) => entry.id === mapProvider)?.label ?? mapProvider;
    const selectedLabel = selected ? localizedDestinationName(selected, locale) : 'None';
    const localeEntry = DEFAULT_APP_LOCALES.find((entry) => entry.code === locale);
    const localeLabel = localeEntry
      ? localeEntry.nativeLabel
        ? `${localeEntry.label} (${localeEntry.nativeLabel})`
        : localeEntry.label
      : locale;

    return [
      { key: 'role' as const, label: 'Role', value: roleLabel(this.userRole()) },
      { key: 'locale' as const, label: 'App locale', value: localeLabel },
      { key: 'map' as const, label: 'Map provider', value: mapLabel },
      { key: 'selected' as const, label: 'Selected', value: selectedLabel },
      { key: 'theme' as const, label: 'Theme', value: themeLabel(this.theme()) },
    ];
  });
}
