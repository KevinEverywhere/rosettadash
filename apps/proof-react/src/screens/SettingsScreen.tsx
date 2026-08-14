import { AppLanguageSelect } from '@rosettadash/react/domain/i18n/app-language-select';
import { DEFAULT_APP_LOCALES } from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';

type Props = Pick<AtlasContext, 'locale' | 'setLocale'>;

export function SettingsScreen({ locale, setLocale }: Props) {
  return (
    <section className="da-panel">
      <h2>Settings</h2>
      <p>App base locale for developer-owned i18n. Does not translate RosettaDash chrome.</p>
      <AppLanguageSelect
        locales={DEFAULT_APP_LOCALES}
        value={locale}
        label="App language"
        placeholder="Select language…"
        onLocaleChange={({ locale: nextLocale }) => setLocale(nextLocale)}
      />
      <p className="da-note">
        Destination labels on Overview, Destinations, Map, and Media use <code>labels[locale]</code>{' '}
        from mock data when available.
      </p>
    </section>
  );
}
