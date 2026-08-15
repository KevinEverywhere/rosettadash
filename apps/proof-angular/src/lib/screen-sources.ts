export const ABOUT_SOURCE = `<AboutScreen>
  <section class="da-panel da-panel--about">
    <!-- Intro, runtime npm packages, Component source panel, docs -->
  </section>
</AboutScreen>`;

export const OVERVIEW_SOURCE = `<OverviewScreen [locale]="locale" [userRole]="userRole">
  <rd-grid columns="3" gap="12" title="Destination KPIs">
    @for (dest of destinations; track dest.id) {
      <rd-kpi [title]="..." [value]="..." [delta]="..." />
    }
  </rd-grid>
  <rd-chart-line title="Visitors over time (aggregate trend)" />
  <rd-chart-bar title="2024 visitors by destination" />

  <rd-role-gate label="Operations metrics" [allowedRoles]="['admin']">
    <rd-plugin-metric-chip chipLabel="Avg. stay" chipValue="4.2 nights" />
    <rd-plugin-status-badge statusText="Data freshness: current" tone="success" />
  </rd-role-gate>
</OverviewScreen>`;

export const GAP_SOURCE = `<GapScreen screenId="..." runtime="angular">
  <!-- Screen not yet ported to @rosettadash/angular proof app -->
</GapScreen>`;

export const SCREEN_SOURCES: Record<string, string> = {
  about: ABOUT_SOURCE,
  overview: OVERVIEW_SOURCE,
  destinations: GAP_SOURCE,
  maps: GAP_SOURCE,
  media: GAP_SOURCE,
  authoring: GAP_SOURCE,
  intel: GAP_SOURCE,
  plan: GAP_SOURCE,
  views: GAP_SOURCE,
  stack: GAP_SOURCE,
  settings: GAP_SOURCE,
};
