<script lang="ts">
  import { MOCK_DESTINATIONS, getDestinationById } from '@destination-atlas';
  import { useConsumerSecrets } from '../lib/consumer-secrets.svelte';
  import { localizedDestinationName } from '../lib/atlas-utils';

  let {
    locale,
    selectedId,
  }: {
    locale: string;
    selectedId: string;
  } = $props();

  const secrets = useConsumerSecrets();

  const selected = $derived(getDestinationById(selectedId));
  const selectedName = $derived(
    selected ? localizedDestinationName(selected, locale) : 'your destination',
  );

  const sampleStops = $derived(
    MOCK_DESTINATIONS.slice(0, 3).map((dest, index) => ({
      day: index + 1,
      name: localizedDestinationName(dest, locale),
      note: index === 0 ? 'Arrival + neighborhood walk' : index === 1 ? 'Museum day' : 'Departure buffer',
    })),
  );
</script>

<div class="da-scout-settings">
  <p class="da-scout-settings__intro">
    Scout is the premium AI deal scout — compare routes and draft itineraries around
    <strong>{selectedName}</strong>. Configure a provider below; keys stay in your browser.
  </p>
  {#if secrets.scoutAiReady}
    <div class="da-scout-demo">
      <p class="da-note">
        Demo itinerary (mock). A live Scout would call your configured provider with destination context and budget
        constraints.
      </p>
      <ol class="da-scout-itinerary">
        {#each sampleStops as stop (stop.day)}
          <li>
            <strong>Day {stop.day}</strong> — {stop.name}
            <span>{stop.note}</span>
          </li>
        {/each}
      </ol>
      <button type="button" class="rd-button" disabled>Regenerate with AI (demo)</button>
    </div>
  {:else}
    <p class="da-note da-byok-cta">
      Add at least one AI provider key below (or set matching <code>VITE_*</code> vars) to unlock Scout.
    </p>
  {/if}
</div>
