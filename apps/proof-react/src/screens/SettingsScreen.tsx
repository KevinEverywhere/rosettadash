import { useEffect, useRef } from 'react';
import { RoleGate } from '@rosettadash/react/domain/role-gate';
import { AppLanguageSelect } from '@rosettadash/react/domain/i18n/app-language-select';
import { DEFAULT_APP_LOCALES } from '@destination-atlas';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { roleLabel } from '../lib/roles';

export const SETTINGS_SOURCE = `<SettingsScreen locale={locale} userRole={userRole} setLocale={setLocale}>
  <RoleGate currentRole={userRole} allowedRoles={['admin']} label="Locale settings">
    <AppLanguageSelect
      locales={DEFAULT_APP_LOCALES}
      value={locale}
      onLocaleChange={({ locale }) => setLocale(locale)}
    />
  </RoleGate>
</SettingsScreen>`;

type Props = Pick<AtlasContext, 'locale' | 'userRole' | 'setLocale' | 'highlightTarget' | 'setHighlightTarget'>;

export function SettingsScreen({
  locale,
  userRole,
  setLocale,
  highlightTarget,
  setHighlightTarget,
}: Props) {
  const localeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightTarget === 'locale') {
      localeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const timer = window.setTimeout(() => setHighlightTarget(null), 2400);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [highlightTarget, setHighlightTarget]);

  return (
    <section className="da-panel">
      <h2>Settings</h2>
      <p>App base locale for developer-owned i18n. Does not translate RosettaDash chrome.</p>
      <div
        ref={localeRef}
        className={highlightTarget === 'locale' ? 'rd-highlight-target' : undefined}
      >
        <RoleGate
          label="Locale settings"
          currentRole={userRole}
          allowedRoles={['admin']}
          statusText="Admin can change app locale"
          hiddenStatusText={`Locale is read-only for ${roleLabel(userRole)}. Switch to Admin to change language.`}
        >
          <AppLanguageSelect
            locales={DEFAULT_APP_LOCALES}
            value={locale}
            label="App language"
            placeholder="Select language…"
            onLocaleChange={({ locale: nextLocale }) => setLocale(nextLocale)}
          />
        </RoleGate>
      </div>
      <dl className="da-settings-readonly">
        <div>
          <dt>Current locale</dt>
          <dd>{locale}</dd>
        </div>
        <div>
          <dt>Your role</dt>
          <dd>{roleLabel(userRole)}</dd>
        </div>
      </dl>
      <p className="da-note">
        Destination labels on Overview, Destinations, Map, and Media use <code>labels[locale]</code>{' '}
        from mock data when available.
      </p>
    </section>
  );
}
