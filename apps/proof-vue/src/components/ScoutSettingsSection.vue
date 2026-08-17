<script setup lang="ts">
import { MOCK_DESTINATIONS, getDestinationById } from '@destination-atlas';
import { useConsumerSecrets } from '../composables/use-consumer-secrets';
import { localizedDestinationName } from '../lib/atlas-utils';

const props = defineProps<{ locale: string; selectedId: string }>();
const secrets = useConsumerSecrets();

const selected = () => getDestinationById(props.selectedId);
const selectedName = () => {
  const dest = selected();
  return dest ? localizedDestinationName(dest, props.locale) : 'your destination';
};

const sampleStops = () =>
  MOCK_DESTINATIONS.slice(0, 3).map((dest, index) => ({
    day: index + 1,
    name: localizedDestinationName(dest, props.locale),
    note: index === 0 ? 'Arrival + neighborhood walk' : index === 1 ? 'Museum day' : 'Departure buffer',
  }));
</script>

<template>
  <div class="da-scout-settings">
    <p class="da-scout-settings__intro">
      Scout is the premium AI deal scout — compare routes and draft itineraries around
      <strong>{{ selectedName() }}</strong>. Configure a provider below; keys stay in your browser.
    </p>
    <div v-if="secrets.scoutAiReady" class="da-scout-demo">
      <p class="da-note">
        Demo itinerary (mock). A live Scout would call your configured provider with destination context and budget
        constraints.
      </p>
      <ol class="da-scout-itinerary">
        <li v-for="stop in sampleStops()" :key="stop.day">
          <strong>Day {{ stop.day }}</strong> — {{ stop.name }}
          <span>{{ stop.note }}</span>
        </li>
      </ol>
      <button type="button" class="rd-button" disabled>Regenerate with AI (demo)</button>
    </div>
    <p v-else class="da-note da-byok-cta">
      Add at least one AI provider key below (or set matching <code>VITE_*</code> vars) to unlock Scout.
    </p>
  </div>
</template>
