import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DESTINATION_ATLAS_ABOUT_INTRO,
  DESTINATION_ATLAS_CURRENT_RUNTIME_BADGE,
  DESTINATION_ATLAS_RUNTIME_GUIDES,
  DESTINATION_ATLAS_RUNTIME_MATRIX_COLUMNS,
  type DestinationAtlasRuntimeId,
} from '@destination-atlas';

const CURRENT_RUNTIME_ID: DestinationAtlasRuntimeId = 'angular';

@Component({
  selector: 'da-about-screen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="da-panel da-panel--about">
      <h2>About Destination Atlas</h2>
      <div class="da-about">
        <p class="da-about__lead">{{ intro.lead }}</p>

        <section class="da-about__section">
          <h3>{{ intro.title }}</h3>
          <p>{{ intro.proofPurpose }}</p>
          <p>{{ intro.consumerInstall }}</p>
        </section>

        <section class="da-about__section">
          <h3>Runtimes — proof apps &amp; Storybook</h3>
          <p>
            Each runtime ships a <strong>proof app</strong> (full Destination Atlas UX) and a
            <strong>Storybook catalog</strong> (isolated component review). Use the same npm package in your
            consumer project.
          </p>
          <p class="da-about__note">{{ intro.runtimeCardsNote }}</p>
          <div class="da-about__runtime-matrix-wrap">
            <div class="da-about__runtime-matrix-head" aria-hidden="true">
              @for (column of matrixColumns; track column.id) {
                <span>{{ column.label }}</span>
              }
            </div>
            <ul class="da-about__runtime-list">
              @for (runtime of runtimes; track runtime.id) {
                <li
                  class="da-about__runtime-card"
                  [class.da-about__runtime-card--current]="runtime.id === currentRuntimeId"
                  [attr.aria-current]="runtime.id === currentRuntimeId ? 'true' : null"
                >
                  <header>
                    <h4>{{ runtime.label }}</h4>
                    <span class="da-about__ticket">{{ runtime.ticket }}</span>
                    @if (runtime.id === currentRuntimeId) {
                      <span class="da-about__runtime-current-badge">{{ currentRuntimeBadge }}</span>
                    }
                  </header>
                  <p>{{ runtime.summary }}</p>
                  <div class="da-about__runtime-matrix">
                    <div class="da-about__runtime-matrix-col">
                      <span class="da-about__runtime-matrix-label">{{ matrixColumns[0].label }}</span>
                      <code>{{ runtime.npmPackage }}</code>
                    </div>
                    <div class="da-about__runtime-matrix-col">
                      <span class="da-about__runtime-matrix-label">{{ matrixColumns[1].label }}</span>
                      <code>{{ runtime.proofCommand }}</code>
                      <span class="da-about__port">localhost:{{ runtime.proofPort }}</span>
                      <span class="da-about__path">{{ runtime.proofPath }}</span>
                    </div>
                    <div class="da-about__runtime-matrix-col">
                      <span class="da-about__runtime-matrix-label">{{ matrixColumns[2].label }}</span>
                      <code>{{ runtime.storybookCommand }}</code>
                      <span class="da-about__port">localhost:{{ runtime.storybookPort }}</span>
                    </div>
                  </div>
                </li>
              }
            </ul>
          </div>
        </section>

        <section class="da-about__section">
          <h3>{{ intro.componentSourceTitle }}</h3>
          <p>{{ intro.componentSourceBody }}</p>
        </section>

        <section class="da-about__section">
          <h3>How to work with components</h3>
          <ol class="da-about__steps">
            <li>
              Open <strong>Storybook</strong> for your runtime — browse palette groups, preview bindings, and copy
              import paths from the catalog.
            </li>
            <li>
              Run the matching <strong>proof app</strong> — see components composed into real screens (React is the
              reference; this Angular app is catching up under DAS-123).
            </li>
            <li>
              On any tab, read the <strong>Component source</strong> panel — inspect template structure, input names,
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
  `,
})
export class AboutScreenComponent {
  readonly intro = DESTINATION_ATLAS_ABOUT_INTRO;
  readonly runtimes = DESTINATION_ATLAS_RUNTIME_GUIDES;
  readonly matrixColumns = DESTINATION_ATLAS_RUNTIME_MATRIX_COLUMNS;
  readonly currentRuntimeId: DestinationAtlasRuntimeId = CURRENT_RUNTIME_ID;
  readonly currentRuntimeBadge = DESTINATION_ATLAS_CURRENT_RUNTIME_BADGE;
}
