import { registerRosettaDashElements } from '@rosettadash/web-components';
import '../../../packages/web-components/src/styles/styles.css';

import {
  DEFAULT_APP_LOCALES,
  DESTINATION_ATLAS_ABOUT_INTRO,
  DESTINATION_ATLAS_CURRENT_RUNTIME_BADGE,
  DESTINATION_ATLAS_RUNTIME_GUIDES,
  DESTINATION_ATLAS_RUNTIME_MATRIX_COLUMNS,
  DESTINATION_ATLAS_SCREENS,
  GEO_MAP_PROVIDERS,
  MOCK_DESTINATIONS,
  formatVisitorCount,
  type Destination,
  type DestinationAtlasRuntimeId,
  type DestinationAtlasScreenId,
  type GeoMapProvider,
} from '@destination-atlas';

const CURRENT_RUNTIME_ID: DestinationAtlasRuntimeId = 'web-components';

registerRosettaDashElements();

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

interface AppState {
  screen: DestinationAtlasScreenId;
  mapsPanel: 'map' | 'globe';
  selectedId: string;
  locale: string;
  mapProvider: GeoMapProvider;
}

const state: AppState = {
  screen: 'overview',
  mapsPanel: 'map',
  selectedId: MOCK_DESTINATIONS[0]?.id ?? '',
  locale: 'en',
  mapProvider: 'leaflet',
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

function renderMapInner(): string {
  const providerOptions = GEO_MAP_PROVIDERS.map(
    (p) => `<option value="${p.id}" ${p.id === state.mapProvider ? 'selected' : ''}>${p.label}</option>`,
  ).join('');
  const active = GEO_MAP_PROVIDERS.find((p) => p.id === state.mapProvider);
  const googleKeyHint =
    state.mapProvider === 'google-maps' && !GOOGLE_MAPS_API_KEY
      ? `<p class="da-note">Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in a <code>.env.local</code> file to load Google Maps.</p>`
      : '';

  return `
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
  `;
}

function renderMap(): string {
  return `
    <section class="da-panel">
      <h2>Map</h2>
      ${renderMapInner()}
    </section>
  `;
}

function renderGlobeInner(): string {
  return renderGap(
    '3D Geo Globe',
    'DAS-126 / WC upgrade',
    'ThreeGeoGlobe is a runtime stub today. WC + Three.js renderer will show textured globe with lat/lng markers.',
  );
}

function renderGlobe(): string {
  return `
    <section class="da-panel">
      <h2>Globe</h2>
      ${renderGlobeInner()}
    </section>
  `;
}

function renderMaps(): string {
  const panelButtons = (['map', 'globe'] as const)
    .map(
      (panel) =>
        `<button type="button" data-maps-panel="${panel}" aria-current="${state.mapsPanel === panel ? 'page' : 'false'}">${panel === 'map' ? 'Map' : 'Globe'}</button>`,
    )
    .join('');

  return `
    <section class="da-panel">
      <h2>Maps</h2>
      <div class="da-maps-panels">${panelButtons}</div>
      ${state.mapsPanel === 'map' ? renderMapInner() : renderGlobeInner()}
    </section>
  `;
}

function renderAbout(): string {
  const matrixHead = DESTINATION_ATLAS_RUNTIME_MATRIX_COLUMNS.map(
    (column) => `<span>${column.label}</span>`,
  ).join('');

  const runtimeRows = DESTINATION_ATLAS_RUNTIME_GUIDES.map((runtime) => {
    const isCurrent = runtime.id === CURRENT_RUNTIME_ID;
    const currentClass = isCurrent ? ' da-about__runtime-card--current' : '';
    const ariaCurrent = isCurrent ? ' aria-current="true"' : '';
    const badge = isCurrent
      ? `<span class="da-about__runtime-current-badge">${DESTINATION_ATLAS_CURRENT_RUNTIME_BADGE}</span>`
      : '';

    return `
      <li class="da-about__runtime-card${currentClass}"${ariaCurrent}>
        <header>
          <h4>${runtime.label}</h4>
          <span class="da-about__ticket">${runtime.ticket}</span>
          ${badge}
        </header>
        <p>${runtime.summary}</p>
        <div class="da-about__runtime-matrix">
          <div class="da-about__runtime-matrix-col">
            <span class="da-about__runtime-matrix-label">${DESTINATION_ATLAS_RUNTIME_MATRIX_COLUMNS[0].label}</span>
            <code>${runtime.npmPackage}</code>
          </div>
          <div class="da-about__runtime-matrix-col">
            <span class="da-about__runtime-matrix-label">${DESTINATION_ATLAS_RUNTIME_MATRIX_COLUMNS[1].label}</span>
            <code>${runtime.proofCommand}</code>
            <span class="da-about__port">localhost:${runtime.proofPort}</span>
            <span class="da-about__path">${runtime.proofPath}</span>
          </div>
          <div class="da-about__runtime-matrix-col">
            <span class="da-about__runtime-matrix-label">${DESTINATION_ATLAS_RUNTIME_MATRIX_COLUMNS[2].label}</span>
            <code>${runtime.storybookCommand}</code>
            <span class="da-about__port">localhost:${runtime.storybookPort}</span>
          </div>
        </div>
      </li>
    `;
  }).join('');

  return `
    <section class="da-panel da-panel--about">
      <h2>About Destination Atlas</h2>
      <div class="da-about">
        <p class="da-about__lead">${DESTINATION_ATLAS_ABOUT_INTRO.lead}</p>

        <section class="da-about__section">
          <h3>${DESTINATION_ATLAS_ABOUT_INTRO.title}</h3>
          <p>${DESTINATION_ATLAS_ABOUT_INTRO.proofPurpose}</p>
          <p>${DESTINATION_ATLAS_ABOUT_INTRO.consumerInstall}</p>
        </section>

        <section class="da-about__section">
          <h3>Runtimes — proof apps &amp; Storybook</h3>
          <p>
            Each runtime ships a <strong>proof app</strong> (full Destination Atlas UX) and a
            <strong>Storybook catalog</strong> (isolated component review). Use the same npm package in your
            consumer project.
          </p>
          <p class="da-about__note">${DESTINATION_ATLAS_ABOUT_INTRO.runtimeCardsNote}</p>
          <div class="da-about__runtime-matrix-wrap">
            <div class="da-about__runtime-matrix-head" aria-hidden="true">${matrixHead}</div>
            <ul class="da-about__runtime-list">${runtimeRows}</ul>
          </div>
        </section>

        <section class="da-about__section">
          <h3>${DESTINATION_ATLAS_ABOUT_INTRO.componentSourceTitle}</h3>
          <p>${DESTINATION_ATLAS_ABOUT_INTRO.componentSourceBody}</p>
        </section>

        <section class="da-about__section">
          <h3>How to work with components</h3>
          <ol class="da-about__steps">
            <li>
              Open <strong>Storybook</strong> for your runtime — browse palette groups, preview bindings, and copy
              import paths from the catalog.
            </li>
            <li>
              Run the matching <strong>proof app</strong> — see components composed into real screens (framework apps
              are the reference; this Web Components app uses CE hosts plus gap placeholders on some tabs).
            </li>
            <li>
              On framework proof tabs, read the <strong>Component source</strong> panel — inspect markup, prop names,
              and how RosettaDash imports nest together.
            </li>
            <li>
              Install packages in your app via npm; wire developer-owned i18n, data, and providers (map tiles, API keys)
              at the component input level.
            </li>
          </ol>
        </section>

        <section class="da-about__section da-about__section--muted da-about__section--last">
          <h3>Documentation</h3>
          <ul class="da-about__doc-links">
            <li><code>docs/43-destination-atlas-proof-apps.md</code> — screen map and mock data</li>
            <li><code>docs/38-storybook-component-catalog.md</code> — Storybook ports and sidebar taxonomy</li>
            <li><code>docs/34-public-component-api.md</code> — import paths and recipes</li>
          </ul>
        </section>
      </div>
    </section>
  `;
}

function renderAuthoring(): string {
  return `
    <section class="da-panel">
      <h2>Authoring</h2>
      ${renderGap('360° authoring', 'DAS-122', 'ffmpeg.wasm crop and preview — React proof only.')}
    </section>
  `;
}

function renderViews(): string {
  return `
    <section class="da-panel">
      <h2>Views</h2>
      ${renderGap('Advanced charts', 'DAS-123', 'Journey flows and carousel demos in framework apps.')}
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
  about: renderAbout,
  overview: renderOverview,
  destinations: renderDestinations,
  maps: renderMaps,
  media: renderMedia,
  authoring: renderAuthoring,
  intel: renderIntel,
  plan: renderPlan,
  views: renderViews,
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

  const nav = DESTINATION_ATLAS_SCREENS.flatMap((s) => {
    if (s.id === 'settings') {
      return [
        `<button type="button" data-open-scout aria-current="false">Scout</button>`,
        `<button type="button" data-screen="${s.id}" aria-current="${state.screen === s.id ? 'page' : 'false'}">${s.label}</button>`,
      ];
    }
    return [
      `<button type="button" data-screen="${s.id}" aria-current="${state.screen === s.id ? 'page' : 'false'}">${s.label}</button>`,
    ];
  }).join('');

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

  root.querySelectorAll('[data-open-scout]').forEach((el) => {
    el.addEventListener('click', () => {
      state.screen = 'settings';
      render();
    });
  });

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

  root.querySelectorAll('[data-maps-panel]').forEach((el) => {
    el.addEventListener('click', () => {
      state.mapsPanel = (el as HTMLElement).dataset.mapsPanel as 'map' | 'globe';
      render();
    });
  });

  const mapSelect = root.querySelector<HTMLSelectElement>('[data-map-provider]');
  mapSelect?.addEventListener('change', () => {
    state.mapProvider = (mapSelect.value as GeoMapProvider) ?? 'leaflet';
    render();
  });

  const mediaSelect = root.querySelector<HTMLSelectElement>('[data-media-dest]');
  mediaSelect?.addEventListener('change', () => {
    state.selectedId = mediaSelect.value;
    render();
  });

  if (state.screen === 'maps' && state.mapsPanel === 'map') {
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
