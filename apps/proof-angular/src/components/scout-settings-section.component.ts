import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MOCK_DESTINATIONS, getDestinationById } from '@destination-atlas';
import { localizedDestinationName } from '../lib/atlas-utils';
import { ConsumerSecretsService } from '../services/consumer-secrets.service';

@Component({
  selector: 'da-scout-settings-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="da-scout-settings">
      <p class="da-scout-settings__intro">
        Scout is the premium AI deal scout — compare routes and draft itineraries around
        <strong>{{ selectedName() }}</strong>. Configure a provider below; keys stay in your browser.
      </p>
      @if (secrets.scoutAiReady()) {
        <div class="da-scout-demo">
          <p class="da-note">
            Demo itinerary (mock). A live Scout would call your configured provider with destination context and
            budget constraints.
          </p>
          <ol class="da-scout-itinerary">
            @for (stop of sampleStops(); track stop.day) {
              <li>
                <strong>Day {{ stop.day }}</strong> — {{ stop.name }}
                <span>{{ stop.note }}</span>
              </li>
            }
          </ol>
          <button type="button" class="rd-button" disabled>Regenerate with AI (demo)</button>
        </div>
      } @else {
        <p class="da-note da-byok-cta">
          Add at least one AI provider key below (or set matching <code>VITE_*</code> vars) to unlock Scout.
        </p>
      }
    </div>
  `,
})
export class ScoutSettingsSectionComponent {
  readonly locale = input.required<string>();
  readonly selectedId = input.required<string>();

  readonly secrets = inject(ConsumerSecretsService);

  readonly selectedName = computed(() => {
    const selected = getDestinationById(this.selectedId());
    return selected ? localizedDestinationName(selected, this.locale()) : 'your destination';
  });

  readonly sampleStops = computed(() =>
    MOCK_DESTINATIONS.slice(0, 3).map((dest, index) => ({
      day: index + 1,
      name: localizedDestinationName(dest, this.locale()),
      note: index === 0 ? 'Arrival + neighborhood walk' : index === 1 ? 'Museum day' : 'Departure buffer',
    })),
  );
}
