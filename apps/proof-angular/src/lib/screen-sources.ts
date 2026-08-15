export const ABOUT_SOURCE = `<AboutScreen>
  <section class="da-panel da-panel--about">
    <!-- Intro, runtime npm packages, Component source panel, docs -->
  </section>
</AboutScreen>`;

export const OVERVIEW_SOURCE = `<OverviewScreen [locale]="locale" [userRole]="userRole">
  <rd-grid columns="3" gap="12" title="Destination KPIs">…</rd-grid>
  <rd-chart-line title="Visitors over time (aggregate trend)" />
  <rd-chart-bar title="2024 visitors by destination" />
  <rd-role-gate label="Operations metrics" [allowedRoles]="['admin']">…</rd-role-gate>
</OverviewScreen>`;

export const SETTINGS_SOURCE = `<SettingsScreen>
  <header><h2>Settings</h2><da-theme-toggle /></header>
  <da-atlas-context-controls [highlightField]="…" />
  <da-collapsible title="Integration keys (BYOK)">…</da-collapsible>
  <da-collapsible title="Scout / AI providers (BYOK)">
    <da-scout-settings-section />
  </da-collapsible>
  <da-bound-textarea-input label="Feedback" />
</SettingsScreen>`;

export const MAPS_SOURCE = `<MapsScreen>…</MapsScreen>`;

export const DESTINATIONS_SOURCE = `<DestinationsScreen>
  <section class="rd-filter-grid">…</section>
  <da-filter-summary />
  <rd-flex>
    <section class="rd-table">…</section>
    <rd-detail>…</rd-detail>
  </rd-flex>
</DestinationsScreen>`;

export const INTEL_SOURCE = `<IntelScreen>
  <da-role-gate-panel>…search + region…</da-role-gate-panel>
  <section class="rd-news-results-table">…</section>
  <rd-news-article-detail>…</rd-news-article-detail>
</IntelScreen>`;

export const GAP_SOURCE = `<GapScreen screenId="..." runtime="angular">…</GapScreen>`;

export const SCREEN_SOURCES: Record<string, string> = {
  about: ABOUT_SOURCE,
  overview: OVERVIEW_SOURCE,
  settings: SETTINGS_SOURCE,
  maps: MAPS_SOURCE,
  destinations: DESTINATIONS_SOURCE,
  intel: INTEL_SOURCE,
  media: GAP_SOURCE,
  plan: GAP_SOURCE,
  views: GAP_SOURCE,
  stack: GAP_SOURCE,
};
