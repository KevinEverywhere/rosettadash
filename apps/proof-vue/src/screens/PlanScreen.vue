<script lang="ts">
export const PLAN_SOURCE = `<PlanScreen userRole={userRole}>
  <RoleGate>… trip planner form …</RoleGate>
</PlanScreen>`;
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { PersonInvite } from '@rosettadash/vue/domain/person-invite';
import { RoleAssign } from '@rosettadash/vue/domain/role-assign';
import { Timer } from '@rosettadash/vue/logic/timer';
import { DateRangeFilter } from '@rosettadash/vue/visual/input/date-range';
import { NumberInput } from '@rosettadash/vue/visual/input/number';
import { CheckboxInput } from '@rosettadash/vue/visual/input/checkbox';
import { MOCK_DESTINATIONS } from '@destination-atlas';
import BoundSelectInput from '../components/BoundSelectInput.vue';
import BoundTextInput from '../components/BoundTextInput.vue';
import BoundTextareaInput from '../components/BoundTextareaInput.vue';
import RoleGatePanel from '../components/RoleGatePanel.vue';
import type { AtlasUserRole } from '../lib/roles';
import { localizedDestinationName } from '../lib/atlas-utils';

const props = defineProps<{ userRole: AtlasUserRole; locale?: string }>();

const tripStart = ref('2026-04-10');
const tripEnd = ref('2026-04-17');
const durationDays = ref(8);

function daySpanInclusive(startDate: string, endDate: string): number | null {
  if (!startDate || !endDate) return null;
  const start = Date.parse(`${startDate}T12:00:00`);
  const end = Date.parse(`${endDate}T12:00:00`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  return Math.round((end - start) / 86_400_000) + 1;
}

const locale = computed(() => props.locale ?? 'en');

const destinationOptions = computed(() =>
  MOCK_DESTINATIONS.map((dest) => ({
    value: dest.id,
    label: localizedDestinationName(dest, locale.value),
  })),
);

function onTripDatesChange(range: { startDate: string; endDate: string }) {
  tripStart.value = range.startDate;
  tripEnd.value = range.endDate;
  const span = daySpanInclusive(range.startDate, range.endDate);
  if (span !== null) durationDays.value = span;
}
</script>

<template>
  <section class="da-panel">
    <h2>Plan</h2>
    <p>Trip planning demo — forms, invites, and timers behind role gates.</p>
    <RoleGatePanel
      gate-label="Trip editor"
      :current-role="userRole"
      :allowed-roles="['editor', 'admin']"
      status-text="Trip editor unlocked"
      hidden-status-text="Plan tools require Editor or Admin role."
    >
      <div class="da-stack da-stack--2">
        <BoundTextInput field-label="Trip name" placeholder="Spring getaway" />
        <BoundSelectInput field-label="Primary destination" :options="destinationOptions" />
        <DateRangeFilter
          label="Trip dates"
          start-label="Departure"
          end-label="Return"
          :start-date="tripStart"
          :end-date="tripEnd"
          @change="onTripDatesChange"
        />
        <NumberInput label="Trip duration (days)" :value="durationDays" />
        <CheckboxInput label="Share itinerary with team" />
        <BoundTextareaInput field-label="Notes" placeholder="Packing list, reservations…" />
        <PersonInvite label="Invite traveler" />
        <RoleAssign label="Assign editor" />
        <Timer label="Booking countdown" :interval-ms="1000" />
      </div>
    </RoleGatePanel>
  </section>
</template>
