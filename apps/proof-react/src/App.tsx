import { DESTINATION_ATLAS_SCREENS, MOCK_DESTINATIONS, getDestinationById } from '@destination-atlas';
import { localizedDestinationName } from './lib/atlas-utils';
import { useDestinationAtlasState } from './state/useDestinationAtlasState';
import { OverviewScreen } from './screens/OverviewScreen';
import { DestinationsScreen } from './screens/DestinationsScreen';
import { MapScreen } from './screens/MapScreen';
import { GlobeScreen } from './screens/GlobeScreen';
import { MediaScreen } from './screens/MediaScreen';
import { IntelScreen } from './screens/IntelScreen';
import { PlanScreen } from './screens/PlanScreen';
import { StackScreen } from './screens/StackScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export function App() {
  const atlas = useDestinationAtlasState(MOCK_DESTINATIONS[0]?.id ?? '');
  const selected = getDestinationById(atlas.selectedId);

  return (
    <div className="da-shell">
      <header className="da-header">
        <h1>Destination Atlas</h1>
        <p>Current and historic information about world locations — React proof (DAS-122)</p>
        <div className="da-locale-bar">
          <span>
            App locale: <strong>{atlas.locale}</strong>
          </span>
          <span>
            Map provider: <strong>{atlas.mapProvider}</strong>
          </span>
          <span>
            Selected:{' '}
            <strong>
              {selected ? localizedDestinationName(selected, atlas.locale) : 'none'}
            </strong>
          </span>
        </div>
      </header>
      <nav className="da-nav" aria-label="Screens">
        {DESTINATION_ATLAS_SCREENS.map((screen) => (
          <button
            key={screen.id}
            type="button"
            aria-current={atlas.screen === screen.id ? 'page' : 'false'}
            onClick={() => atlas.setScreen(screen.id)}
          >
            {screen.label}
          </button>
        ))}
      </nav>
      {atlas.screen === 'overview' ? <OverviewScreen locale={atlas.locale} /> : null}
      {atlas.screen === 'destinations' ? (
        <DestinationsScreen
          locale={atlas.locale}
          selectedId={atlas.selectedId}
          setSelectedId={atlas.setSelectedId}
          destSearch={atlas.destSearch}
          setDestSearch={atlas.setDestSearch}
          destRegion={atlas.destRegion}
          setDestRegion={atlas.setDestRegion}
          timePreset={atlas.timePreset}
          setTimePreset={atlas.setTimePreset}
        />
      ) : null}
      {atlas.screen === 'map' ? (
        <MapScreen
          locale={atlas.locale}
          selectedId={atlas.selectedId}
          setSelectedId={atlas.setSelectedId}
          mapProvider={atlas.mapProvider}
          setMapProvider={atlas.setMapProvider}
          mapTabId={atlas.mapTabId}
          setMapTabId={atlas.setMapTabId}
        />
      ) : null}
      {atlas.screen === 'globe' ? (
        <GlobeScreen locale={atlas.locale} selectedId={atlas.selectedId} />
      ) : null}
      {atlas.screen === 'media' ? (
        <MediaScreen
          locale={atlas.locale}
          selectedId={atlas.selectedId}
          setSelectedId={atlas.setSelectedId}
        />
      ) : null}
      {atlas.screen === 'intel' ? (
        <IntelScreen
          newsQuery={atlas.newsQuery}
          setNewsQuery={atlas.setNewsQuery}
          newsRegion={atlas.newsRegion}
          setNewsRegion={atlas.setNewsRegion}
          selectedArticleId={atlas.selectedArticleId}
          setSelectedArticleId={atlas.setSelectedArticleId}
        />
      ) : null}
      {atlas.screen === 'plan' ? <PlanScreen /> : null}
      {atlas.screen === 'stack' ? <StackScreen /> : null}
      {atlas.screen === 'settings' ? (
        <SettingsScreen locale={atlas.locale} setLocale={atlas.setLocale} />
      ) : null}
    </div>
  );
}
