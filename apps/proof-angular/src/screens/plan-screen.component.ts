import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PersonInvite } from '@rosettadash/angular/domain/person-invite';
import { RoleAssign } from '@rosettadash/angular/domain/role-assign';
import { Timer } from '@rosettadash/angular/logic/timer';
import { MOCK_DESTINATIONS } from '@destination-atlas';
import { localizedDestinationName } from '../lib/atlas-utils';
import { AtlasStateService } from '../services/atlas-state.service';
import { RoleGatePanelComponent } from '../components/role-gate-panel.component';
import {
  FormSectionComponent,
  FormSectionGridComponent,
} from '../components/form-section-grid.component';
import {
  DaBoundSelectInputComponent,
  DaBoundTextInputComponent,
  DaBoundTextareaInputComponent,
} from '../components/proof-form-fields.component';

function daySpanInclusive(startDate: string, endDate: string): number | null {
  if (!startDate || !endDate) {
    return null;
  }
  const start = Date.parse(`${startDate}T12:00:00`);
  const end = Date.parse(`${endDate}T12:00:00`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }
  return Math.round((end - start) / 86_400_000) + 1;
}

function endDateFromStartAndDays(startDate: string, days: number): string {
  const start = new Date(`${startDate}T12:00:00`);
  start.setDate(start.getDate() + Math.max(1, days) - 1);
  return start.toISOString().slice(0, 10);
}

@Component({
  selector: 'da-plan-screen',
  standalone: true,
  imports: [
    PersonInvite,
    RoleAssign,
    Timer,
    RoleGatePanelComponent,
    FormSectionGridComponent,
    FormSectionComponent,
    DaBoundTextInputComponent,
    DaBoundSelectInputComponent,
    DaBoundTextareaInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="da-panel">
      <h2>Plan trip</h2>
      <p>Trip planning, collaboration, and role-gated editor access.</p>
      <div class="da-stack">
        <da-role-gate-panel
          gateLabel="Trip editor"
          [currentRole]="atlas.userRole()"
          [allowedRoles]="['editor', 'admin']"
          statusText="Editor workspace unlocked"
          hiddenStatusText="Trip editing requires Editor or Admin. Switch role in the header to continue planning."
        >
          <da-form-section-grid>
            <da-form-section title="Collaboration">
              <rd-person-invite emailPlaceholder="planner@company.com" />
              <rd-role-assign summary="Confirm collaborator access for this itinerary." />
            </da-form-section>
            <da-form-section title="Trip details" [columns]="2">
              <da-bound-text-input [fieldLabel]="'Trip name'" placeholder="Spring heritage tour" />
              <da-bound-select-input
                [fieldLabel]="'Primary destination'"
                placeholder="Select destination…"
                [options]="destinationOptions()"
              />
              <div class="da-plan-field-span-2">
                <section class="rd-input-date-range">
                  <span class="rd-field__label">Trip dates</span>
                  <div class="rd-date-range__controls">
                    <label>
                      <span class="rd-field__label">Departure</span>
                      <input type="date" class="rd-input" [value]="tripStart()" (change)="onStartChange($event)" />
                    </label>
                    <span class="rd-date-range__sep">to</span>
                    <label>
                      <span class="rd-field__label">Return</span>
                      <input type="date" class="rd-input" [value]="tripEnd()" (change)="onEndChange($event)" />
                    </label>
                  </div>
                </section>
              </div>
              <div class="da-plan-field-span-2 da-plan-trip-meta">
                <section class="rd-input-number">
                  <span class="rd-field__label">Trip duration (days)</span>
                  <input
                    type="number"
                    class="rd-input"
                    min="1"
                    [value]="computedDuration() ?? durationDays()"
                    (change)="onDurationChange($any($event.target).value)"
                  />
                </section>
                <section class="rd-input-number">
                  <span class="rd-field__label">Travelers</span>
                  <input type="number" class="rd-input" min="1" value="2" />
                </section>
                <label class="rd-input-checkbox">
                  <input type="checkbox" checked />
                  Share itinerary with team
                </label>
              </div>
            </da-form-section>
            <da-form-section title="Notes" [fullWidth]="true">
              <da-bound-textarea-input
                [fieldLabel]="'Notes'"
                placeholder="Visa requirements, rail passes, accessibility…"
              />
            </da-form-section>
          </da-form-section-grid>
        </da-role-gate-panel>
        <rd-timer label="Itinerary refresh" mode="interval" intervalMs="5000" [tickCount]="3" />
      </div>
    </section>
  `,
})
export class PlanScreenComponent {
  readonly atlas = inject(AtlasStateService);

  readonly tripStart = signal('2026-04-10');
  readonly tripEnd = signal('2026-04-17');
  readonly durationDays = signal(8);

  readonly destinationOptions = computed(() =>
    MOCK_DESTINATIONS.map((dest) => ({
      value: dest.id,
      label: localizedDestinationName(dest, this.atlas.locale()),
    })),
  );

  readonly computedDuration = computed(() => daySpanInclusive(this.tripStart(), this.tripEnd()));

  onStartChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.tripStart.set(value);
    this.syncDurationFromDates(value, this.tripEnd());
  }

  onEndChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.tripEnd.set(value);
    this.syncDurationFromDates(this.tripStart(), value);
  }

  onDurationChange(value: string): void {
    const days = Math.max(1, Number(value) || 1);
    this.durationDays.set(days);
    if (this.tripStart()) {
      this.tripEnd.set(endDateFromStartAndDays(this.tripStart(), days));
    }
  }

  private syncDurationFromDates(startDate: string, endDate: string): void {
    const span = daySpanInclusive(startDate, endDate);
    if (span !== null) {
      this.durationDays.set(span);
    }
  }
}
