import {
  DESTINATION_ATLAS_ABOUT_INTRO,
  DESTINATION_ATLAS_RUNTIME_GUIDES,
} from '@destination-atlas';

export const ABOUT_SOURCE = `<AboutScreen>
  <section className="da-panel da-panel--about">
    {/* Intro, runtime npm packages, Component source panel, docs */}
  </section>
</AboutScreen>`;

export function AboutScreen() {
  return (
    <section className="da-panel da-panel--about">
      <h2>About Destination Atlas</h2>
      <div className="da-about">
        <p className="da-about__lead">{DESTINATION_ATLAS_ABOUT_INTRO.lead}</p>

        <section className="da-about__section">
          <h3>{DESTINATION_ATLAS_ABOUT_INTRO.title}</h3>
          <p>{DESTINATION_ATLAS_ABOUT_INTRO.proofPurpose}</p>
          <p>{DESTINATION_ATLAS_ABOUT_INTRO.consumerInstall}</p>
        </section>

        <section className="da-about__section">
          <h3>Runtimes — proof apps &amp; Storybook</h3>
          <p>
            Each runtime ships a <strong>proof app</strong> (full Destination Atlas UX) and a{' '}
            <strong>Storybook catalog</strong> (isolated component review). Use the same npm package in your
            consumer project.
          </p>
          <p className="da-about__note">{DESTINATION_ATLAS_ABOUT_INTRO.runtimeCardsNote}</p>
          <ul className="da-about__runtime-list">
            {DESTINATION_ATLAS_RUNTIME_GUIDES.map((runtime) => (
              <li key={runtime.id} className="da-about__runtime-card">
                <header>
                  <h4>{runtime.label}</h4>
                  <span className="da-about__ticket">{runtime.ticket}</span>
                </header>
                <p>{runtime.summary}</p>
                <dl className="da-about__commands">
                  <div>
                    <dt>Package</dt>
                    <dd>
                      <code>{runtime.npmPackage}</code>
                    </dd>
                  </div>
                  <div>
                    <dt>Proof app</dt>
                    <dd>
                      <code>{runtime.proofCommand}</code>
                      <span className="da-about__port">localhost:{runtime.proofPort}</span>
                      <span className="da-about__path">{runtime.proofPath}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Storybook</dt>
                    <dd>
                      <code>{runtime.storybookCommand}</code>
                      <span className="da-about__port">localhost:{runtime.storybookPort}</span>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <section className="da-about__section">
          <h3>{DESTINATION_ATLAS_ABOUT_INTRO.componentSourceTitle}</h3>
          <p>{DESTINATION_ATLAS_ABOUT_INTRO.componentSourceBody}</p>
        </section>

        <section className="da-about__section">
          <h3>How to work with components</h3>
          <ol className="da-about__steps">
            <li>
              Open <strong>Storybook</strong> for your runtime — browse palette groups, preview bindings, and copy
              import paths from the catalog.
            </li>
            <li>
              Run the matching <strong>proof app</strong> — see components composed into real screens (this React app
              is the reference implementation).
            </li>
            <li>
              On any other tab, read the <strong>Component source</strong> panel — inspect JSX structure, prop names,
              and how RosettaDash imports nest together.
            </li>
            <li>
              Install packages in your app via npm; wire developer-owned i18n, data, and providers (map tiles, API keys)
              at the component prop level.
            </li>
          </ol>
        </section>

        <section className="da-about__section da-about__section--muted da-about__section--last">
          <h3>Documentation</h3>
          <ul className="da-about__doc-links">
            <li>
              <code>docs/43-destination-atlas-proof-apps.md</code> — screen map and mock data
            </li>
            <li>
              <code>docs/38-storybook-component-catalog.md</code> — Storybook ports and sidebar taxonomy
            </li>
            <li>
              <code>docs/34-public-component-api.md</code> — import paths and recipes
            </li>
          </ul>
        </section>
      </div>
    </section>
  );
}
