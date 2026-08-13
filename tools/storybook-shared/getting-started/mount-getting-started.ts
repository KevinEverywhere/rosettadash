import {
  defaultComponentRegistry,
  listCompositeTemplates,
  resolvePaletteGroups,
} from '@rosettadash/core';
import {
  META_COMPOSITIONS,
  NPM_ATOM_IDS,
} from '../meta-compositions/composition-definitions.js';
import {
  GETTING_STARTED_STORY_NAMES,
  META_COMPOSITION_STORY_NAMES,
  wireStorybookNavigation,
} from '../storybook-navigation.js';
import { navigateToPaletteComponent } from '../palette-catalog/mount-palette-catalog.js';
import {
  PALETTE_GROUP_GUIDES,
  PALETTE_GROUP_STORY_NAMES,
} from '../palette-catalog/palette-group-guides.js';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function metaCompositionsForType(componentType: string): string[] {
  return META_COMPOSITIONS.filter(
    (composition) =>
      composition.componentTypes.includes(componentType) ||
      composition.sections.some((section) => section.items.includes(componentType)),
  ).map((composition) => composition.id);
}

function renderPaletteGroupLinks(): string {
  return resolvePaletteGroups()
    .map((group) => {
      const label = PALETTE_GROUP_STORY_NAMES[group.id] ?? group.label;
      return `<button type="button" class="rd-getting-started__chip-link" data-nav-group="${esc(group.id)}">${esc(label)}</button>`;
    })
    .join('');
}

function renderMetaCompositionLinks(): string {
  return META_COMPOSITIONS.map(
    (composition) =>
      `<button type="button" class="rd-getting-started__chip-link" data-nav-meta-composition="${esc(composition.id)}">${esc(composition.title)}</button>`,
  ).join('');
}

function renderTemplateList(): string {
  return listCompositeTemplates()
    .map(
      (template) =>
        `<div class="rd-getting-started__template">
          <span class="rd-getting-started__template-name">${esc(template.name)}</span>
          <p class="rd-getting-started__template-desc">${esc(template.description)}</p>
        </div>`,
    )
    .join('');
}

const paletteTypeCount = resolvePaletteGroups().reduce((sum, group) => sum + group.items.length, 0);

/** Memorable landing page — how Storybook maps to the builder. */
export function mountStartHere(): HTMLElement {
  const root = document.createElement('article');
  root.className = 'rd-getting-started';

  root.innerHTML = `
    <header class="rd-getting-started__hero">
      <p class="rd-getting-started__eyebrow">RosettaDash · Web components catalog</p>
      <h1 class="rd-getting-started__title">See every component. Compose like the builder.</h1>
      <p class="rd-getting-started__lede">
        This Storybook mirrors the RosettaDash builder palette — isolated demos, grouped guidance,
        and live dashboard compositions. Pure custom elements today; React catalog follows once atoms ship.
      </p>
      <div class="rd-getting-started__stats">
        <div class="rd-getting-started__stat">
          <span class="rd-getting-started__stat-value">${paletteTypeCount}</span>
          <span class="rd-getting-started__stat-label">Palette components</span>
        </div>
        <div class="rd-getting-started__stat">
          <span class="rd-getting-started__stat-value">${NPM_ATOM_IDS.length}</span>
          <span class="rd-getting-started__stat-label">NPM atoms</span>
        </div>
        <div class="rd-getting-started__stat">
          <span class="rd-getting-started__stat-value">${META_COMPOSITIONS.length}</span>
          <span class="rd-getting-started__stat-label">Live compositions</span>
        </div>
        <div class="rd-getting-started__stat">
          <span class="rd-getting-started__stat-value">${resolvePaletteGroups().length}</span>
          <span class="rd-getting-started__stat-label">Palette groups</span>
        </div>
      </div>
    </header>

    <section class="rd-getting-started__section">
      <h2 class="rd-getting-started__section-title">How this catalog is arranged</h2>
      <pre class="rd-getting-started__map">Getting Started
  ├─ Start here          ← you are here
  └─ Component count     ← full index with deep links

Catalog
  ├─ Palette             ← one story per builder group + All components scroll
  └─ Meta compositions   ← dashboards & recipes (diagram + live preview + XML)</pre>
    </section>

    <section class="rd-getting-started__section">
      <div class="rd-getting-started__grid rd-getting-started__grid--two">
        <article class="rd-getting-started__card">
          <h3>Palette — learn one component</h3>
          <p>
            Every builder taxonomy type on grouped pages with spec cards, relationship guides,
            and interactive demos (table → detail, news flow, Three.js hosts, timers).
          </p>
          <div class="rd-getting-started__links">
            <button type="button" class="rd-getting-started__link rd-getting-started__link--primary" data-nav-palette-all>Browse all components</button>
            <button type="button" class="rd-getting-started__link" data-nav-getting-started="${esc(GETTING_STARTED_STORY_NAMES.componentCount)}">Component index</button>
          </div>
        </article>
        <article class="rd-getting-started__card">
          <h3>Meta compositions — see them work together</h3>
          <p>
            Ten live dashboard layouts with a schematic diagram beside the preview.
            Each composition covers a cross-section of palette groups — the fastest way to understand real layouts.
          </p>
          <div class="rd-getting-started__links">
            <button type="button" class="rd-getting-started__link rd-getting-started__link--primary" data-nav-meta-composition="operations-kpi">Operations KPI dashboard</button>
            <button type="button" class="rd-getting-started__link" data-nav-meta-composition="coverage">Coverage audit</button>
          </div>
        </article>
      </div>
    </section>

    <section class="rd-getting-started__section">
      <h2 class="rd-getting-started__section-title">Ready-made groups in the builder</h2>
      <p class="rd-getting-started__lede">
        In RosettaDash, open the toolbar <strong>Select template…</strong> pulldown and click
        <strong>Apply template</strong> to drop a wired component group onto the canvas — the same
        patterns you explore under <strong>Catalog → Meta compositions</strong>.
      </p>
      <div class="rd-getting-started__templates">${renderTemplateList()}</div>
    </section>

    <section class="rd-getting-started__section">
      <h2 class="rd-getting-started__section-title">Palette groups</h2>
      <p class="rd-getting-started__lede">Jump directly to a builder group story.</p>
      <div class="rd-getting-started__links">${renderPaletteGroupLinks()}</div>
    </section>

    <section class="rd-getting-started__section">
      <h2 class="rd-getting-started__section-title">Featured compositions</h2>
      <div class="rd-getting-started__links">${renderMetaCompositionLinks()}</div>
    </section>

    <p class="rd-getting-started__footnote">
      Run locally: <code>npm run storybook:web-components</code> (port 6006).
      React, Vue, Angular, and Svelte catalogs share the same taxonomy — web components first.
    </p>
  `;

  wireStorybookNavigation(root);
  return root;
}

function renderComponentIndexRow(componentType: string): string {
  const definition = defaultComponentRegistry.get(componentType);
  const label = definition?.label ?? componentType;
  const compositions = metaCompositionsForType(componentType);
  const compositionLinks = compositions
    .map(
      (id) =>
        `<button type="button" class="rd-component-index__action" data-nav-meta-composition="${esc(id)}">${esc(META_COMPOSITION_STORY_NAMES[id] ?? id)}</button>`,
    )
    .join('');

  return `<tr>
    <td>${esc(label)}</td>
    <td class="rd-component-index__type"><code>${esc(componentType)}</code></td>
    <td>
      <div class="rd-component-index__actions">
        <button type="button" class="rd-component-index__action" data-nav-component-type="${esc(componentType)}">Palette →</button>
      </div>
    </td>
    <td>
      <div class="rd-component-index__actions">${
        compositionLinks ||
        '<span class="rd-component-index__action rd-component-index__action--muted">—</span>'
      }</div>
    </td>
  </tr>`;
}

function renderNpmAtomRow(atomId: string): string {
  const label = atomId.replace('npm.rd-', 'rd-');
  const compositions = metaCompositionsForType(atomId);
  const compositionLinks = compositions
    .map(
      (id) =>
        `<button type="button" class="rd-component-index__action" data-nav-meta-composition="${esc(id)}">${esc(META_COMPOSITION_STORY_NAMES[id] ?? id)}</button>`,
    )
    .join('');

  return `<tr>
    <td>${esc(label)}</td>
    <td class="rd-component-index__type"><code>${esc(atomId)}</code></td>
    <td>
      <div class="rd-component-index__actions">
        <button type="button" class="rd-component-index__action" data-nav-component-type="${esc(atomId)}">Palette →</button>
      </div>
    </td>
    <td>
      <div class="rd-component-index__actions">${compositionLinks}</div>
    </td>
  </tr>`;
}

/** Full component index — every type with palette and composition deep links. */
export function mountComponentCountIndex(): HTMLElement {
  const root = document.createElement('article');
  root.className = 'rd-getting-started rd-component-index';

  const groupsHtml = resolvePaletteGroups()
    .map((group) => {
      const guide = PALETTE_GROUP_GUIDES[group.id];
      const fitLabel =
        guide?.fit === 'universal'
          ? 'Fits most dashboards'
          : guide?.fit === 'specialized'
            ? 'Specialized flow'
            : 'Mixed';

      const rows = group.items
        .map((definition) => renderComponentIndexRow(definition.type))
        .join('');

      return `<section class="rd-component-index__group" id="index-${esc(group.id)}">
        <div class="rd-component-index__group-header">
          <h2 class="rd-component-index__group-title">${esc(PALETTE_GROUP_STORY_NAMES[group.id] ?? group.label)}</h2>
          <button type="button" class="rd-getting-started__link" data-nav-group="${esc(group.id)}">Open group →</button>
        </div>
        <p class="rd-component-index__summary">${esc(guide?.summary ?? `${group.items.length} components`)} · ${esc(fitLabel)}</p>
        <div class="rd-component-index__table-wrap">
          <table class="rd-component-index__table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Taxonomy type</th>
                <th>Palette</th>
                <th>Meta composition</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>`;
    })
    .join('');

  const npmRows = NPM_ATOM_IDS.map((atomId) => renderNpmAtomRow(atomId)).join('');

  root.innerHTML = `
    <header class="rd-getting-started__hero">
      <p class="rd-getting-started__eyebrow">Component index</p>
      <h1 class="rd-getting-started__title">${paletteTypeCount + NPM_ATOM_IDS.length} components at a glance</h1>
      <p class="rd-getting-started__lede">
        Every builder palette type and shipped npm atom — with one-click navigation to its
        isolated palette demo or a live meta composition where it appears.
      </p>
      <div class="rd-getting-started__links" style="margin-top: 1rem">
        <button type="button" class="rd-getting-started__link rd-getting-started__link--primary" data-nav-palette-all>All components (full scroll)</button>
        <button type="button" class="rd-getting-started__link" data-nav-getting-started="${esc(GETTING_STARTED_STORY_NAMES.startHere)}">← Start here</button>
      </div>
    </header>
    ${groupsHtml}
    <section class="rd-component-index__group" id="index-npm-atoms">
      <div class="rd-component-index__group-header">
        <h2 class="rd-component-index__group-title">NPM layout atoms (rd-*)</h2>
        <button type="button" class="rd-getting-started__link" data-nav-group="layout">Layout &amp; Navigation</button>
      </div>
      <p class="rd-component-index__summary">Shipped custom elements not duplicated as builder palette rows.</p>
      <div class="rd-component-index__table-wrap">
        <table class="rd-component-index__table">
          <thead>
            <tr>
              <th>Atom</th>
              <th>Id</th>
              <th>Palette</th>
              <th>Meta composition</th>
            </tr>
          </thead>
          <tbody>${npmRows}</tbody>
        </table>
      </div>
    </section>
  `;

  wireStorybookNavigation(root);

  root.querySelectorAll<HTMLElement>('[data-nav-component-type]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      const componentType = el.getAttribute('data-nav-component-type');
      if (componentType) {
        navigateToPaletteComponent(componentType);
      }
    });
  });

  return root;
}
