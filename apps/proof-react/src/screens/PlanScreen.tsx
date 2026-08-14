import { useMemo, useState } from 'react';
import { PersonInvite } from '@rosettadash/react/domain/person-invite';
import { RoleAssign } from '@rosettadash/react/domain/role-assign';
import { RoleGate } from '@rosettadash/react/domain/role-gate';
import { FormSectionGrid } from '@rosettadash/react/layout/form-section';
import { Timer } from '@rosettadash/react/logic/timer';
import { TextInput } from '@rosettadash/react/visual/input/text';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import { NumberInput } from '@rosettadash/react/visual/input/number';
import { TextareaInput } from '@rosettadash/react/visual/input/textarea';
import { CheckboxInput } from '@rosettadash/react/visual/input/checkbox';
import { DateRangeFilter } from '@rosettadash/react/visual/input/date-range';
import { MOCK_DESTINATIONS } from '@destination-atlas';
import type { AtlasUserRole } from '../lib/roles';
import { localizedDestinationName } from '../lib/atlas-utils';

export const PLAN_SOURCE = `<PlanScreen userRole={userRole}>
  <RoleGate currentRole={userRole} allowedRoles={['editor', 'admin']} label="Trip editor">
    <FormSectionGrid>
      <FormSectionGrid.Section title="Trip details" columns={2}>
        <TextInput label="Trip name" />
        <SelectInput label="Primary destination" />
        <DateRangeFilter label="Trip dates" granularity="date" />
        <NumberInput label="Trip duration (days)" />
        <NumberInput label="Travelers" value={2} />
        <CheckboxInput label="Share itinerary with team" />
      </FormSectionGrid.Section>
    </FormSectionGrid>
  </RoleGate>
</PlanScreen>`;

type Props = {
  userRole: AtlasUserRole;
  locale?: string;
};

function daySpanInclusive(startDate: string, endDate: string): number | null {
  if (!startDate || !endDate) {
    return null;
  }
  const start = Date.parse(startDate);
  const end = Date.parse(endDate);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }
  return Math.round((end - start) / 86_400_000) + 1;
}

export function PlanScreen({ userRole, locale = 'en' }: Props) {
  const [tripStart, setTripStart] = useState('2026-04-10');
  const [tripEnd, setTripEnd] = useState('2026-04-17');
  const [durationDays, setDurationDays] = useState(8);

  const computedDuration = useMemo(() => daySpanInclusive(tripStart, tripEnd), [tripStart, tripEnd]);

  const onTripDatesChange = (range: { startDate: string; endDate: string }) => {
    setTripStart(range.startDate);
    setTripEnd(range.endDate);
    const span = daySpanInclusive(range.startDate, range.endDate);
    if (span !== null) {
      setDurationDays(span);
    }
  };

  return (
    <section className="da-panel">
      <h2>Plan trip</h2>
      <p>Trip planning, collaboration, and role-gated editor access.</p>
      <div className="da-stack">
        <RoleGate
          label="Trip editor"
          currentRole={userRole}
          allowedRoles={['editor', 'admin']}
          statusText="Editor workspace unlocked"
          hiddenStatusText="Trip editing requires Editor or Admin. Switch role in the header to continue planning."
        >
          <FormSectionGrid>
            <FormSectionGrid.Section title="Collaboration">
              <PersonInvite emailPlaceholder="planner@company.com" />
              <RoleAssign
                summary="Confirm collaborator access for this itinerary."
                roleOptions={[
                  { value: 'viewer', label: 'Viewer' },
                  { value: 'editor', label: 'Editor' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />
            </FormSectionGrid.Section>
            <FormSectionGrid.Section title="Trip details" columns={2}>
              <TextInput label="Trip name" placeholder="Spring heritage tour" />
              <SelectInput
                label="Primary destination"
                placeholder="Select destination…"
                options={MOCK_DESTINATIONS.map((dest) => ({
                  value: dest.id,
                  label: localizedDestinationName(dest, locale),
                }))}
              />
              <DateRangeFilter
                label="Trip dates"
                granularity="date"
                startDate={tripStart}
                endDate={tripEnd}
                onChange={onTripDatesChange}
              />
              <NumberInput
                label="Trip duration (days)"
                value={durationDays}
                onChange={(value) => setDurationDays(value || 1)}
              />
              <NumberInput label="Travelers" value={2} />
              <CheckboxInput label="Share itinerary with team" defaultChecked />
            </FormSectionGrid.Section>
            {computedDuration !== null && computedDuration !== durationDays ? (
              <p className="da-note">
                Selected dates span <strong>{computedDuration}</strong> day{computedDuration === 1 ? '' : 's'} — duration
                field can be adjusted independently for partial travel days.
              </p>
            ) : null}
            <FormSectionGrid.Section title="Notes" fullWidth>
              <TextareaInput label="Notes" placeholder="Visa requirements, rail passes, accessibility…" />
            </FormSectionGrid.Section>
          </FormSectionGrid>
        </RoleGate>
        <Timer label="Itinerary refresh" mode="interval" intervalMs={5000} tickCount={3} />
      </div>
    </section>
  );
}
