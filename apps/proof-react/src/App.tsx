import { DESTINATION_ATLAS_SCREENS, MOCK_DESTINATIONS, getDestinationById } from '@destination-atlas';
import { localizedDestinationName } from './lib/atlas-utils';
import { screenAllowedForRole, roleLabel } from './lib/roles';
import { useDestinationAtlasState } from './state/useDestinationAtlasState';
import { AboutScreen, ABOUT_SOURCE } from './screens/AboutScreen';
import { OverviewScreen, OVERVIEW_SOURCE } from './screens/OverviewScreen';
import { DestinationsScreen, DESTINATIONS_SOURCE } from './screens/DestinationsScreen';
import { MapScreen, MAP_SOURCE } from './screens/MapScreen';
import { GlobeScreen, GLOBE_SOURCE } from './screens/GlobeScreen';
import { MediaScreen, MEDIA_SOURCE } from './screens/MediaScreen';
import { AuthoringScreen, AUTHORING_SOURCE } from './screens/AuthoringScreen';
import { IntelScreen, INTEL_SOURCE } from './screens/IntelScreen';
import { PlanScreen, PLAN_SOURCE } from './screens/PlanScreen';
import { ViewsScreen, VIEWS_SOURCE } from './screens/ViewsScreen';
import { StackScreen, STACK_SOURCE } from './screens/StackScreen';
import { SettingsScreen, SETTINGS_SOURCE } from './screens/SettingsScreen';
import { ThemeToggle, useThemePreference } from './lib/theme';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScreenWorkbench } from './components/ScreenWorkbench';
import { UserRoleToggle } from './components/UserRoleToggle';

const SCREEN_SOURCES: Record<string, string> = {
  about: ABOUT_SOURCE,
  overview: OVERVIEW_SOURCE,
  destinations: DESTINATIONS_SOURCE,
  map: MAP_SOURCE,
  globe: GLOBE_SOURCE,
  media: MEDIA_SOURCE,
  authoring: AUTHORING_SOURCE,
  intel: INTEL_SOURCE,
  plan: PLAN_SOURCE,
  views: VIEWS_SOURCE,
  stack: STACK_SOURCE,
  settings: SETTINGS_SOURCE,
};

export function App() {
  const atlas = useDestinationAtlasState(MOCK_DESTINATIONS[0]?.id ?? '');
  const { theme, setTheme } = useThemePreference();
  const selected = getDestinationById(atlas.selectedId);
  const activeScreen = DESTINATION_ATLAS_SCREENS.find((screen) => screen.id === atlas.screen);
  const visibleScreens = DESTINATION_ATLAS_SCREENS.filter((screen) =>
    screenAllowedForRole(screen.id, atlas.userRole),
  );

  const openSettingsLocale = () => {
    atlas.setHighlightTarget('locale');
    atlas.setScreen('settings');
  };

  const openMapSettings = () => {
    atlas.setScreen('map');
  };

  return (
    <div className="da-shell">
      <header className="da-header">
        <h1>Destination Atlas</h1>
        <p>Current and historic information about world locations — React proof (DAS-122)</p>
        <div className="da-header-tools">
          <ThemeToggle theme={theme} onChange={setTheme} />
          <UserRoleToggle role={atlas.userRole} onChange={atlas.setUserRole} />
          <div className="da-locale-bar">
            <span>
              Role: <strong>{roleLabel(atlas.userRole)}</strong>
            </span>
            <button type="button" className="da-locale-link" onClick={openSettingsLocale}>
              App locale: <strong>{atlas.locale}</strong>
            </button>
            <button type="button" className="da-locale-link" onClick={openMapSettings}>
              Map provider: <strong>{atlas.mapProvider}</strong>
            </button>
            {selected ? (
              <button
                type="button"
                className="da-locale-link"
                onClick={() => atlas.focusDestinationOnMap(atlas.selectedId)}
              >
                Selected: <strong>{localizedDestinationName(selected, atlas.locale)}</strong>
              </button>
            ) : (
              <span>
                Selected: <strong>none</strong>
              </span>
            )}
          </div>
        </div>
      </header>
      <nav className="da-nav" aria-label="Screens">
        {visibleScreens.map((screen) => (
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
      <ErrorBoundary label={activeScreen?.label ?? atlas.screen}>
        <ScreenWorkbench source={SCREEN_SOURCES[atlas.screen] ?? ''} scrollablePreview={atlas.screen === 'about'}>
          {atlas.screen === 'about' ? <AboutScreen /> : null}
          {atlas.screen === 'overview' ? (
            <OverviewScreen locale={atlas.locale} userRole={atlas.userRole} />
          ) : null}
          {atlas.screen === 'destinations' ? (
            <DestinationsScreen
              locale={atlas.locale}
              userRole={atlas.userRole}
              selectedId={atlas.selectedId}
              setSelectedId={atlas.setSelectedId}
              destSearch={atlas.destSearch}
              setDestSearch={atlas.setDestSearch}
              destRegion={atlas.destRegion}
              setDestRegion={atlas.setDestRegion}
              timePreset={atlas.timePreset}
              setTimePreset={atlas.setTimePreset}
              visitPeriodStart={atlas.visitPeriodStart}
              visitPeriodEnd={atlas.visitPeriodEnd}
              setVisitPeriod={atlas.setVisitPeriod}
              focusDestinationOnMap={atlas.focusDestinationOnMap}
            />
          ) : null}
          {atlas.screen === 'map' ? (
            <MapScreen
              locale={atlas.locale}
              selectedId={atlas.selectedId}
              setSelectedId={atlas.setSelectedId}
              mapProvider={atlas.mapProvider}
              setMapProvider={atlas.setMapProvider}
              mapLocationQuery={atlas.mapLocationQuery}
              setMapLocationQuery={atlas.setMapLocationQuery}
              mapViewOverride={atlas.mapViewOverride}
              focusDestinationOnMap={atlas.focusDestinationOnMap}
              goToMapView={atlas.goToMapView}
            />
          ) : null}
          {atlas.screen === 'globe' ? (
            <GlobeScreen
              locale={atlas.locale}
              selectedId={atlas.selectedId}
              setSelectedId={atlas.setSelectedId}
              focusDestinationOnMap={atlas.focusDestinationOnMap}
            />
          ) : null}
          {atlas.screen === 'media' ? (
            <MediaScreen
              locale={atlas.locale}
              selectedId={atlas.selectedId}
              setSelectedId={atlas.setSelectedId}
            />
          ) : null}
          {atlas.screen === 'authoring' ? <AuthoringScreen locale={atlas.locale} /> : null}
          {atlas.screen === 'intel' ? (
            <IntelScreen
              userRole={atlas.userRole}
              newsQuery={atlas.newsQuery}
              setNewsQuery={atlas.setNewsQuery}
              newsRegion={atlas.newsRegion}
              setNewsRegion={atlas.setNewsRegion}
              selectedArticleId={atlas.selectedArticleId}
              setSelectedArticleId={atlas.setSelectedArticleId}
            />
          ) : null}
          {atlas.screen === 'plan' ? <PlanScreen userRole={atlas.userRole} locale={atlas.locale} /> : null}
          {atlas.screen === 'views' ? (
            <ViewsScreen locale={atlas.locale} selectedId={atlas.selectedId} setSelectedId={atlas.setSelectedId} />
          ) : null}
          {atlas.screen === 'stack' ? <StackScreen userRole={atlas.userRole} /> : null}
          {atlas.screen === 'settings' ? (
            <SettingsScreen
              locale={atlas.locale}
              userRole={atlas.userRole}
              setLocale={atlas.setLocale}
              highlightTarget={atlas.highlightTarget}
              setHighlightTarget={atlas.setHighlightTarget}
            />
          ) : null}
        </ScreenWorkbench>
      </ErrorBoundary>
    </div>
  );
}
