import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  DEFAULT_APP_LOCALES,
  GEO_MAP_PROVIDERS,
  MOCK_DESTINATIONS,
  type GeoMapProvider,
} from '@destination-atlas';
import { ATLAS_USER_ROLES, type AtlasUserRole } from '../lib/roles';
import { localizedDestinationName } from '../lib/atlas-utils';
import type { SettingFieldTarget } from '../lib/settings-highlight';
import { DaBoundSelectInputComponent } from './proof-form-fields.component';

const ROLE_HINT = 'Preview permissions for gated screens.';
const LOCALE_HINT = 'Base locale for developer-owned destination labels.';
const MAP_HINT = 'Default 2D map engine for the Map screen.';
const SELECTED_HINT = 'Active destination across tabs and URL state.';

@Component({
  selector: 'da-atlas-context-controls',
  standalone: true,
  imports: [DaBoundSelectInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="da-context-grid">
      @for (field of fields(); track field.key) {
        <div
          class="da-context-grid__cell"
          [class.rd-highlight-target]="highlightField() === field.key"
          [attr.data-setting]="field.key"
        >
          <da-bound-select-input
            [fieldLabel]="field.label"
            [options]="field.options"
            [value]="field.value"
            (valueChange)="field.onChange($event)"
          />
          <p class="da-context-grid__hint">{{ field.hint }}</p>
        </div>
      }
    </div>
  `,
})
export class AtlasContextControlsComponent {
  readonly locale = input.required<string>();
  readonly userRole = input.required<AtlasUserRole>();
  readonly mapProvider = input.required<GeoMapProvider>();
  readonly selectedId = input.required<string>();
  readonly highlightField = input<SettingFieldTarget | null>(null);

  readonly localeChange = output<string>();
  readonly userRoleChange = output<AtlasUserRole>();
  readonly mapProviderChange = output<GeoMapProvider>();
  readonly selectedIdChange = output<string>();

  readonly fields = computed(() => {
    const locale = this.locale();
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

    return [
      {
        key: 'role' as const,
        label: 'Role',
        hint: ROLE_HINT,
        value: this.userRole(),
        options: ATLAS_USER_ROLES.map((entry) => ({ value: entry.id, label: entry.label })),
        onChange: (value: string) => this.userRoleChange.emit(value as AtlasUserRole),
      },
      {
        key: 'locale' as const,
        label: 'App locale',
        hint: LOCALE_HINT,
        value: locale,
        options: localeOptions,
        onChange: (value: string) => this.localeChange.emit(value),
      },
      {
        key: 'map' as const,
        label: 'Map provider',
        hint: MAP_HINT,
        value: this.mapProvider(),
        options: mapOptions,
        onChange: (value: string) => this.mapProviderChange.emit(value as GeoMapProvider),
      },
      {
        key: 'selected' as const,
        label: 'Selected',
        hint: SELECTED_HINT,
        value: this.selectedId(),
        options: destinationOptions,
        onChange: (value: string) => this.selectedIdChange.emit(value),
      },
    ];
  });
}
