<script module lang="ts">
  export const PLAN_SOURCE = `<PlanScreen userRole={userRole}>
  <RoleGate currentRole={userRole} allowedRoles={['editor', 'admin']} label="Trip editor">
    … trip planner form …
  </RoleGate>
</PlanScreen>`;
</script>

<script lang="ts">
  import PersonInvite from '@rosettadash/svelte/domain/person-invite';
  import RoleAssign from '@rosettadash/svelte/domain/role-assign';
  import Timer from '@rosettadash/svelte/logic/timer';
  import DateRangeFilter from '@rosettadash/svelte/visual/input/date-range';
  import NumberInput from '@rosettadash/svelte/visual/input/number';
  import CheckboxInput from '@rosettadash/svelte/visual/input/checkbox';
  import { MOCK_DESTINATIONS } from '@destination-atlas';
  import BoundSelectInput from '../components/BoundSelectInput.svelte';
  import BoundTextInput from '../components/BoundTextInput.svelte';
  import BoundTextareaInput from '../components/BoundTextareaInput.svelte';
  import RoleGatePanel from '../components/RoleGatePanel.svelte';
  import type { AtlasUserRole } from '../lib/roles';
  import { localizedDestinationName } from '../lib/atlas-utils';

  let {
    userRole,
    locale = 'en',
  }: {
    userRole: AtlasUserRole;
    locale?: string;
  } = $props();

  let tripStart = $state('2026-04-10');
  let tripEnd = $state('2026-04-17');
  let durationDays = $state(8);

  function daySpanInclusive(startDate: string, endDate: string): number | null {
    if (!startDate || !endDate) return null;
    const start = Date.parse(`${startDate}T12:00:00`);
    const end = Date.parse(`${endDate}T12:00:00`);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
    return Math.round((end - start) / 86_400_000) + 1;
  }

  const destinationOptions = $derived(
    MOCK_DESTINATIONS.map((dest) => ({
      value: dest.id,
      label: localizedDestinationName(dest, locale),
    })),
  );

  function onTripDatesChange(range: { startDate: string; endDate: string }) {
    tripStart = range.startDate;
    tripEnd = range.endDate;
    const span = daySpanInclusive(range.startDate, range.endDate);
    if (span !== null) durationDays = span;
  }
</script>

<section class="da-panel">
  <h2>Plan</h2>
  <p>Trip planning demo — forms, invites, and timers behind role gates.</p>
  <RoleGatePanel
    gateLabel="Trip editor"
    currentRole={userRole}
    allowedRoles={['editor', 'admin']}
    statusText="Trip editor unlocked"
    hiddenStatusText="Plan tools require Editor or Admin role."
  >
    <div class="da-stack da-stack--2">
      <BoundTextInput fieldLabel="Trip name" placeholder="Spring getaway" />
      <BoundSelectInput fieldLabel="Primary destination" options={destinationOptions} />
      <DateRangeFilter
        label="Trip dates"
        startDate={tripStart}
        endDate={tripEnd}
        onChange={onTripDatesChange}
      />
      <NumberInput label="Trip duration (days)" value={durationDays} />
      <CheckboxInput label="Share itinerary with team" />
      <BoundTextareaInput fieldLabel="Notes" placeholder="Packing list, reservations…" />
      <PersonInvite label="Invite traveler" />
      <RoleAssign label="Assign editor" />
      <Timer label="Booking countdown" intervalMs={1000} />
    </div>
  </RoleGatePanel>
</section>
