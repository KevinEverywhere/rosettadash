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

  return `
    <section class="da-panel">
      <h2>Map</h2>
      ${renderGap(
        'Geo Map',
        'DAS-128',
        '2D slippy map with developer-selectable provider (MapLibre, Leaflet, Google Maps).',
        `
        <div class="da-provider-select">
          <label for="map-provider">Map provider (component prop preview)</label>
          <select id="map-provider" data-map-provider>
            ${providerOptions}
          </select>
        </div>
        ${
          active
            ? `<dl>
                <dt>Cost</dt><dd>${active.costSummary}</dd>
                <dt>API key</dt><dd>${active.apiKeyRequired ? 'Required' : 'Optional'}</dd>
                <dt>Notes</dt><dd>${active.notes}</dd>
              </dl>`
            : ''
        }
        <p>Markers: ${MOCK_DESTINATIONS.map((d) => localizedName(d)).join(', ')}</p>
        `,
      )}
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
  return `
    <section class="da-panel">
      <h2>Media</h2>
      ${renderGap(
        'YouTube Embed',
        'DAS-129',
        `Privacy-enhanced iframe for destination videos${selected?.youtubeId ? ` (e.g. ${selected.youtubeId})` : ''}.`,
      )}
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
  const options = DEFAULT_APP_LOCALES.map(
    (l) =>
      `<option value="${l.code}" ${l.code === state.locale ? 'selected' : ''}>${l.label}${l.nativeLabel ? ` (${l.nativeLabel})` : ''}</option>`,
  ).join('');

  return `
    <section class="da-panel">
      <h2>Settings</h2>
      ${renderGap(
        'App Language Select',
        'DAS-127',
        'Sets app base locale for developer i18n. Does not translate RosettaDash chrome. Emits locale-change.',
        `
        <div class="da-provider-select">
          <label for="app-locale">App locale preview (until rd-app-language-select ships)</label>
          <select id="app-locale" data-app-locale>${options}</select>
        </div>
        <p>Demo: destination names above use <code>labels[locale]</code> from mock data when available.</p>
        `,
      )}
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

  const localeSelect = root.querySelector<HTMLSelectElement>('[data-app-locale]');
  localeSelect?.addEventListener('change', () => {
    state.locale = localeSelect.value;
    render();
  });
}

render();
