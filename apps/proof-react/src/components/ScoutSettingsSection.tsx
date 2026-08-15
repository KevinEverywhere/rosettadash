import { MOCK_DESTINATIONS, getDestinationById } from '@destination-atlas';
import { useConsumerSecrets } from '../state/consumer-secrets-context';
import { localizedDestinationName } from '../lib/atlas-utils';

type Props = {
  locale: string;
  selectedId: string;
};

export function ScoutSettingsSection({ locale, selectedId }: Props) {
  const secrets = useConsumerSecrets();
  const selected = getDestinationById(selectedId);
  const selectedName = selected ? localizedDestinationName(selected, locale) : 'your destination';

  const sampleStops = MOCK_DESTINATIONS.slice(0, 3).map((dest, index) => ({
    day: index + 1,
    name: localizedDestinationName(dest, locale),
    note: index === 0 ? 'Arrival + neighborhood walk' : index === 1 ? 'Museum day' : 'Departure buffer',
  }));

  return (
    <div className="da-scout-settings">
      <p className="da-scout-settings__intro">
        Scout is the premium AI deal scout — compare routes and draft itineraries around{' '}
        <strong>{selectedName}</strong>. Configure a provider below; keys stay in your browser.
      </p>
      {secrets.scoutAiReady ? (
        <div className="da-scout-demo">
          <p className="da-note">
            Demo itinerary (mock). A live Scout would call your configured provider with destination context and
            budget constraints.
          </p>
          <ol className="da-scout-itinerary">
            {sampleStops.map((stop) => (
              <li key={stop.day}>
                <strong>Day {stop.day}</strong> — {stop.name}
                <span>{stop.note}</span>
              </li>
            ))}
          </ol>
          <button type="button" className="rd-button" disabled>
            Regenerate with AI (demo)
          </button>
        </div>
      ) : (
        <p className="da-note da-byok-cta">
          Add at least one AI provider key below (or set matching <code>VITE_*</code> vars) to unlock Scout.
        </p>
      )}
    </div>
  );
}
