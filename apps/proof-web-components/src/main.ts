import { registerRosettaDashElements } from '@rosettadash/web-components';
import '../../../packages/web-components/src/styles/styles.css';

import {
  DEFAULT_APP_LOCALES,
  DESTINATION_ATLAS_SCREENS,
  GEO_MAP_PROVIDERS,
  MOCK_DESTINATIONS,
  formatVisitorCount,
  type Destination,
  type DestinationAtlasScreenId,
  type GeoMapProvider,
} from '@destination-atlas';

registerRosettaDashElements();

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

interface AppState {
  screen: DestinationAtlasScreenId;
  selectedId: string;
  locale: string;
  mapProvider: GeoMapProvider;
}

const state: AppState = {
  screen: 'overview',
  selectedId: MOCK_DESTINATIONS[0]?.id ?? '',
  locale: 'en',
  mapProvider: 'maplibre',
};

function localizedName(dest: Destination): string {
  return dest.labels?.[state.locale] ?? dest.name;
}

function renderGap(
  title: string,
  ticket: string,
  description: string,
  extra?: string,
): string {
  return `
    <div class="da-gap" data-testid="gap-placeholder">
      <h3>${title} <small>(${ticket})</small></h3>
      <p>${description}</p>
      ${extra ?? ''}
    </div>
  `;
}

function buildMapMarkers(): Array<{ id: string; lat: number; lng: number; label: string }> {
  return MOCK_DESTINATIONS.map((dest) => ({
    id: dest.id,
    lat: dest.lat,
    lng: dest.lng,
    label: localizedName(dest),
  }));
}

function mapView(): { lat: number; lng: number; zoom: number } {
  const selected = MOCK_DESTINATIONS.find((dest) => dest.id === state.selectedId);
  if (selected) {
    return { lat: selected.lat, lng: selected.lng, zoom: 5 };
  }
  return { lat: 20, lng: 0, zoom: 2 };
}

function renderOverview(): string {
  const cards = MOCK_DESTINATIONS.map(
    (d) => `
      <div class="da-kpi">
        <span>${localizedName(d)}</span>
        <strong>${formatVisitorCount(d.visitorsCurrent)}</strong>
        <small>visitors (2024)</small>
      </div>
    `,
  ).join('');

  return `
    <section class="da-panel">
      <h2>Overview</h2>
      <p>Current visitor KPIs across sample destinations. Framework proof apps add LineChart/BarChart here.</p>
      <div class="da-grid">${cards}</div>
    </section>
  `;
}

function renderDestinations(): string {
  const selected = MOCK_DESTINATIONS.find((d) => d.id === state.selectedId);
  const rows = MOCK_DESTINATIONS.map(
    (d) =>
      `<li><button type="button" data-select-dest="${d.id}">${localizedName(d)}</button> — ${d.region}</li>`,
  ).join('');

  return `
    <section class="da-panel">
      <h2>Destinations</h2>
      <p>Framework apps use DataTable + DetailPanel. WC app uses link-list pattern below.</p>
      <ul class="da-dest-list">${rows}</ul>
      ${
        selected
          ? `<p><strong>Selected:</strong> ${localizedName(selected)} — ${formatVisitorCount(selected.visitorsCurrent)} visitors</p>
             <p><strong>Historic:</strong> ${selected.visitorsHistoric.map((h) => `${h.year}: ${formatVisitorCount(h.visitors)}`).join(' · ')}</p>`
          : ''
      }
    </section>
  `;
}

function renderMap(): string {
  const providerOptions = GEO_MAP_PROVIDERS.map(
    (p) => `<option value="${p.id}" ${p.id === state.mapProvider ? 'selected' : ''}>${p.label}</option>`,
  ).join('');
  const active = GEO_MAP_PROVIDERS.find((p) => p.id === state.mapProvider);
  const googleKeyHint =
    state.mapProvider === 'google-maps' && !GOOGLE_MAPS_API_KEY
      ? `<p class="da-note">Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in a <code>.env.local</code> file to load Google Maps.</p>`
      : '';

  return `
    <section class="da-panel">
      <h2>Map</h2>
      <p>2D slippy map with developer-selectable provider (<code>visual.display.geo-map</code>).</p>
      <div class="da-provider-select">
        <label for="map-provider">Map provider (component prop)</label>
        <select id="map-provider" data-map-provider>
          ${providerOptions}
        </select>
      </div>
      ${
        active
          ? `<dl class="da-provider-meta">
              <dt>Cost</dt><dd>${active.costSummary}</dd>
              <dt>API key</dt><dd>${active.apiKeyRequired ? 'Required' : 'Optional'}</dd>
              <dt>Notes</dt><dd>${active.notes}</dd>
            </dl>`
          : ''
      }
      ${googleKeyHint}
      <rd-geo-map class="da-geo-map" data-ref="geo-map"></rd-geo-map>
      <p class="da-note">Click a marker to select a destination. Selected: <strong>${state.selectedId || 'none'}</strong></p>
    </section>
  `;
}

function renderGlobe(): string {
  return `
    <section class="da-panel">
      <h2>Globe</h2>
      ${renderGap(
        '3D Geo Globe',
        'DAS-126 / WC upgrade',
        'ThreeGeoGlobe is a runtime stub today. WC + Three.js renderer will show textured globe with lat/lng markers.',
      )}
    </section>
  `;
}

function renderMedia(): string {
  const selected = MOCK_DESTINATIONS.find((d) => d.id === state.selectedId);
  const options = MOCK_DESTINATIONS.filter((d) => d.youtubeId)
    .map(
      (d) =>
        `<option value="${d.id}" ${d.id === state.selectedId ? 'selected' : ''}>${localizedName(d)}</option>`,
    )
    .join('');

  return `
    <section class="da-panel">
      <h2>Media</h2>
      <p>YouTube embed (<code>visual.media.youtube-embed</code>) for destination highlight videos.</p>
      <div class="da-provider-select">
        <label for="media-dest">Destination video</label>
        <select id="media-dest" data-media-dest>${options}</select>
      </div>
      <rd-youtube-embed class="da-youtube" data-ref="youtube-embed"></rd-youtube-embed>
      ${
        !selected?.youtubeId
          ? '<p class="da-note">Select a destination with a YouTube id.</p>'
          : ''
      }
      <rd-video-source label="Local / file video source"></rd-video-source>
      <p style="margin-top:1rem"><em>Equirect viewport and wasm-media available in framework proof apps.</em></p>
    </section>
  `;
}

function renderIntel(): string {
  return `
    <section class="da-panel">
      <h2>Intel</h2>
      <p>News module (region/language selects, search, results table) ships in framework runtimes — not WC CE yet.</p>
      ${renderGap(
        'News discovery',
        'native runtime',
        'NewsSearchBox, NewsRegionSelect, NewsLanguageSelect (API filter — distinct from app-language-select), NewsResultsTable.',
      )}
    </section>
  `;
}

function renderPlan(): string {
  return `
    <section class="da-panel">
      <h2>Plan trip</h2>
      ${renderGap('Collaboration + forms', 'DAS-122–125', 'RoleGate, PersonInvite, RoleAssign, Timer, and form inputs in framework apps.')}
    </section>
  `;
}

function renderStack(): string {
  return `
    <section class="da-panel">
      <h2>Stack</h2>
      <p>Read-only infra demo (EnvConfig, database nodes, server scaffolds) — framework apps only.</p>
    </section>
  `;
}

function renderSettings(): string {
  return `
    <section class="da-panel">
      <h2>Settings</h2>
      <p>App base locale for developer i18n (<code>domain.i18n.app-language-select</code>). Does not translate RosettaDash chrome.</p>
      <rd-app-language-select data-ref="app-language-select"></rd-app-language-select>
      <p class="da-note">Demo: destination names on Overview, Destinations, and Map use <code>labels[locale]</code> from mock data when available.</p>
    </section>
  `;
}

const SCREEN_RENDERERS: Record<DestinationAtlasScreenId, () => string> = {
  overview: renderOverview,
  destinations: renderDestinations,
  map: renderMap,
  globe: renderGlobe,
  media: renderMedia,
  intel: renderIntel,
  plan: renderPlan,
  stack: renderStack,
  settings: renderSettings,
};

function wireGeoMap(root: HTMLElement): void {
  const geoMap = root.querySelector('[data-ref="geo-map"]');
  if (!geoMap) {
    return;
  }

  const view = mapView();
  geoMap.setAttribute('provider', state.mapProvider);
  geoMap.setAttribute('center', JSON.stringify({ lat: view.lat, lng: view.lng }));
  geoMap.setAttribute('zoom', String(view.zoom));
  geoMap.setAttribute('markers', JSON.stringify(buildMapMarkers()));
  geoMap.setAttribute('selected-id', state.selectedId);

  if (state.mapProvider === 'google-maps' && GOOGLE_MAPS_API_KEY) {
    geoMap.setAttribute('api-key', GOOGLE_MAPS_API_KEY);
  } else {
    geoMap.removeAttribute('api-key');
  }

  geoMap.addEventListener('marker-select', (event) => {
    const detail = (event as CustomEvent<{ id: string }>).detail;
    state.selectedId = detail.id;
    geoMap.setAttribute('selected-id', detail.id);
    root.querySelector('.da-note strong')?.replaceChildren(detail.id);
  });
}

function wireAppLanguageSelect(root: HTMLElement): void {
  const languageSelect = root.querySelector('[data-ref="app-language-select"]');
  if (!languageSelect) {
    return;
  }

  languageSelect.setAttribute('locales', JSON.stringify(DEFAULT_APP_LOCALES));
  languageSelect.setAttribute('value', state.locale);
  languageSelect.setAttribute('label', 'App language');
  languageSelect.setAttribute('placeholder', 'Select language…');

  languageSelect.addEventListener('locale-change', (event) => {
    state.locale = (event as CustomEvent<{ locale: string }>).detail.locale;
    render();
  });
}

function wireYoutubeEmbed(root: HTMLElement): void {
  const embed = root.querySelector('[data-ref="youtube-embed"]');
  if (!embed) {
    return;
  }

  const selected = MOCK_DESTINATIONS.find((dest) => dest.id === state.selectedId);
  if (selected?.youtubeId) {
    embed.setAttribute('video-id', selected.youtubeId);
    embed.setAttribute('embed-title', `${localizedName(selected)} — destination video`);
  } else {
    embed.removeAttribute('video-id');
    embed.setAttribute('embed-title', 'Destination video');
  }
}

function render(): void {
  const root = document.getElementById('app');
  if (!root) {
    return;
  }

  const nav = DESTINATION_ATLAS_SCREENS.map(
    (s) =>
      `<button type="button" data-screen="${s.id}" aria-current="${state.screen === s.id ? 'page' : 'false'}">${s.label}</button>`,
  ).join('');

  root.innerHTML = `
    <div class="da-shell">
      <header class="da-header">
        <h1>Destination Atlas</h1>
        <p>Current and historic information about world locations — Web Components proof (DAS-121)</p>
        <div class="da-locale-bar">
          <span>App locale: <strong>${state.locale}</strong></span>
          <span>Map provider: <strong>${state.mapProvider}</strong></span>
          <span>Selected: <strong>${state.selectedId || 'none'}</strong></span>
        </div>
      </header>
      <nav class="da-nav" aria-label="Screens">${nav}</nav>
      ${SCREEN_RENDERERS[state.screen]()}
    </div>
  `;

  root.querySelectorAll('[data-screen]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = (el as HTMLElement).dataset.screen as DestinationAtlasScreenId;
      state.screen = id;
      render();
    });
  });

  root.querySelectorAll('[data-select-dest]').forEach((el) => {
    el.addEventListener('click', () => {
      state.selectedId = (el as HTMLElement).dataset.selectDest ?? '';
      render();
    });
  });

  const mapSelect = root.querySelector<HTMLSelectElement>('[data-map-provider]');
  mapSelect?.addEventListener('change', () => {
    state.mapProvider = (mapSelect.value as GeoMapProvider) ?? 'maplibre';
    render();
  });

  const mediaSelect = root.querySelector<HTMLSelectElement>('[data-media-dest]');
  mediaSelect?.addEventListener('change', () => {
    state.selectedId = mediaSelect.value;
    render();
  });

  if (state.screen === 'map') {
    wireGeoMap(root);
  }

  if (state.screen === 'settings') {
    wireAppLanguageSelect(root);
  }

  if (state.screen === 'media') {
    wireYoutubeEmbed(root);
  }
}

render();
