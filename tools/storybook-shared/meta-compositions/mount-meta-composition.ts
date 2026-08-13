import { defaultComponentRegistry } from '@rosettadash/core';
import {
  documentationTocItemsJson,
  navigationLinkItemsJson,
} from '../fixtures.js';
import { wireCatalogInteractivity, navigateToPaletteComponent } from '../palette-catalog/mount-palette-catalog.js';
import { renderPlainComponentMarkup } from '../palette-catalog/render-component-markup.js';
import { renderPaletteDemo } from '../palette-catalog/palette-demos.js';
import {
  META_COMPOSITION_STORY_NAMES,
  wireStorybookNavigation,
} from '../storybook-navigation.js';
import {
  ALL_PALETTE_TYPES,
  META_COMPOSITIONS,
  NPM_ATOM_IDS,
  type MetaCompositionDefinition,
  uncoveredPaletteTypes,
} from './composition-definitions.js';
import { renderCompositionDiagram } from './render-composition-diagram.js';
import { wireMetaCompositionPanels } from './wire-meta-composition-panels.js';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderNpmAtom(atomId: string): string {
  switch (atomId) {
    case 'npm.rd-accordion':
      return `<rd-accordion heading="Resources" default-open><p>Slot content for filters, copy, or nested lists.</p></rd-accordion>`;
    case 'npm.rd-link-list':
      return `<rd-link-list items='${navigationLinkItemsJson}'></rd-link-list>`;
    case 'npm.rd-accordion-link-list':
      return `<rd-accordion-link-list heading="On this page" default-open items='${documentationTocItemsJson}'></rd-accordion-link-list>`;
    default:
      return `<div class="preview-fallback"><code>${esc(atomId)}</code></div>`;
  }
}

function renderItem(itemId: string): { label: string; html: string; markup: string } {
  if (itemId.startsWith('npm.')) {
    const label = itemId.replace('npm.rd-', 'rd-').replace('npm.', '');
    const html = renderNpmAtom(itemId);
    return { label, html, markup: html };
  }

  const definition = defaultComponentRegistry.get(itemId);
  if (!definition) {
    return {
      label: itemId,
      html: `<div class="preview-fallback"><span>Unknown type</span><code>${esc(itemId)}</code></div>`,
      markup: `<!-- unknown type: ${esc(itemId)} -->`,
    };
  }

  return {
    label: definition.label,
    html: renderPaletteDemo(itemId, definition),
    markup: renderPlainComponentMarkup(definition),
  };
}

function buildLivePanel(definition: MetaCompositionDefinition): HTMLElement {
  const live = document.createElement('div');
  live.className = 'rd-meta-composition__live';

  definition.sections.forEach((section, sectionIndex) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = `rd-meta-composition__section rd-meta-composition__section--${section.layout ?? 'stack'}`;
    sectionEl.dataset.diagramSection = String(sectionIndex);

    const sectionHeader = document.createElement('h4');
    sectionHeader.className = 'rd-meta-composition__section-title';
    sectionHeader.textContent = section.title;
    sectionEl.appendChild(sectionHeader);

    const grid = document.createElement('div');
    grid.className = 'rd-meta-composition__items';
    sectionEl.appendChild(grid);

    section.items.forEach((itemId, itemIndex) => {
      const { label, html } = renderItem(itemId);
      const item = document.createElement('div');
      item.className = 'rd-meta-composition__item';
      item.dataset.componentType = itemId;
      item.dataset.diagramTarget = `s${sectionIndex}-i${itemIndex}`;
      item.innerHTML = `<header class="rd-meta-composition__item-header">
          <span class="rd-meta-composition__item-label">${esc(label)}</span>
          <button type="button" class="rd-meta-composition__palette-link" data-palette-link>Palette →</button>
        </header>
        <div class="rd-meta-composition__item-demo">${html}</div>`;
      grid.appendChild(item);
    });

    live.appendChild(sectionEl);
  });

  return live;
}

function buildXmlPanel(definition: MetaCompositionDefinition): HTMLElement {
  const xml = document.createElement('aside');
  xml.className = 'rd-meta-composition__xml';
  xml.setAttribute('aria-label', 'Component XML');

  const xmlHint = document.createElement('p');
  xmlHint.className = 'rd-meta-composition__xml-hint';
  xmlHint.textContent =
    'Underlying custom-element markup only — no Storybook demo chrome or preview wrappers.';
  xml.appendChild(xmlHint);

  definition.sections.forEach((section, sectionIndex) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'rd-meta-composition__section rd-meta-composition__section--xml';

    const sectionHeader = document.createElement('h4');
    sectionHeader.className = 'rd-meta-composition__section-title';
    sectionHeader.textContent = section.title;
    sectionEl.appendChild(sectionHeader);

    const list = document.createElement('div');
    list.className = 'rd-meta-composition__xml-items';

    section.items.forEach((itemId, itemIndex) => {
      const { label, markup } = renderItem(itemId);
      const item = document.createElement('div');
      item.className = 'rd-meta-composition__xml-item';
      item.dataset.componentType = itemId;
      item.dataset.diagramTarget = `s${sectionIndex}-i${itemIndex}`;
      item.innerHTML = `<header class="rd-meta-composition__xml-item-header">
          <span class="rd-meta-composition__xml-item-label">${esc(label)}</span>
          <button type="button" class="rd-meta-composition__palette-link" data-palette-link>Palette →</button>
        </header>
        <pre class="rd-meta-composition__xml-snippet"><code>${esc(markup)}</code></pre>`;
      list.appendChild(item);
    });

    sectionEl.appendChild(list);
    xml.appendChild(sectionEl);
  });

  return xml;
}

function scrollWithinPanel(panel: HTMLElement | null, target: HTMLElement): void {
  if (!panel) {
    return;
  }

  const panelRect = panel.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  if (targetRect.top >= panelRect.top && targetRect.bottom <= panelRect.bottom) {
    return;
  }

  const nextTop =
    targetRect.top - panelRect.top + panel.scrollTop - (panel.clientHeight - target.offsetHeight) / 2;

  panel.scrollTo({
    top: Math.max(0, Math.min(nextTop, panel.scrollHeight - panel.clientHeight)),
    behavior: 'smooth',
  });
}

function wireDiagramHover(root: HTMLElement): void {
  const split = root.querySelector<HTMLElement>('.rd-meta-composition__split');
  if (!split) {
    return;
  }

  function diagramBlocks(): HTMLElement[] {
    return [...split.querySelectorAll<HTMLElement>('.rd-meta-diagram__block[data-diagram-target]')];
  }

  function liveItems(): HTMLElement[] {
    return [...split.querySelectorAll<HTMLElement>('.rd-meta-composition__item[data-diagram-target]')];
  }

  function xmlItems(): HTMLElement[] {
    return [...split.querySelectorAll<HTMLElement>('.rd-meta-composition__xml-item[data-diagram-target]')];
  }

  function clearHighlight(): void {
    for (const el of diagramBlocks()) {
      el.classList.remove('rd-meta-diagram__block--active');
    }
    for (const el of liveItems()) {
      el.classList.remove('rd-meta-composition__item--highlight');
    }
    for (const el of xmlItems()) {
      el.classList.remove('rd-meta-composition__xml-item--highlight');
    }
  }

  function highlight(
    target: string,
    options: { scrollLive?: boolean; scrollDiagram?: boolean } = {},
  ): void {
    clearHighlight();
    let liveMatch: HTMLElement | null = null;
    let diagramMatch: HTMLElement | null = null;

    for (const el of diagramBlocks()) {
      if (el.dataset.diagramTarget === target) {
        el.classList.add('rd-meta-diagram__block--active');
        diagramMatch = el;
      }
    }

    for (const el of liveItems()) {
      if (el.dataset.diagramTarget === target) {
        el.classList.add('rd-meta-composition__item--highlight');
        liveMatch = el;
      }
    }

    for (const el of xmlItems()) {
      if (el.dataset.diagramTarget === target) {
        el.classList.add('rd-meta-composition__xml-item--highlight');
      }
    }

    if (options.scrollLive && liveMatch) {
      scrollWithinPanel(liveMatch.closest('.rd-meta-composition__live'), liveMatch);
    }

    if (options.scrollDiagram && diagramMatch) {
      scrollWithinPanel(diagramMatch.closest('.rd-meta-composition__diagram'), diagramMatch);
    }
  }

  split.addEventListener('mouseover', (event) => {
    const hovered = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      '[data-diagram-target]',
    );
    if (!hovered || !split.contains(hovered)) {
      return;
    }
    const target = hovered.dataset.diagramTarget;
    if (!target) {
      return;
    }
    const fromDiagram = Boolean(hovered.closest('.rd-meta-diagram'));
    const fromLive = Boolean(hovered.closest('.rd-meta-composition__live'));
    const fromXml = Boolean(hovered.closest('.rd-meta-composition__xml'));

    highlight(target, {
      scrollLive: fromDiagram,
      scrollDiagram: fromLive || fromXml,
    });
  });

  split.addEventListener('mouseleave', (event) => {
    const related = event.relatedTarget as Node | null;
    if (related && split.contains(related)) {
      return;
    }
    clearHighlight();
  });

  for (const block of diagramBlocks()) {
    block.tabIndex = 0;
    block.addEventListener('focus', () => {
      const target = block.dataset.diagramTarget;
      if (target) {
        highlight(target, { scrollLive: true });
      }
    });
    block.addEventListener('blur', () => {
      clearHighlight();
    });
  }
}

function wirePaletteLinks(root: HTMLElement, container: HTMLElement): void {
  container.querySelectorAll<HTMLElement>('[data-palette-link]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const item = button.closest<HTMLElement>('[data-component-type]');
      const componentType = item?.dataset.componentType;
      if (componentType) {
        navigateToPaletteComponent(componentType);
      }
    });
  });
}

function wireMetaCompositionNavigation(root: HTMLElement): void {
  const split = root.querySelector<HTMLElement>('.rd-meta-composition__split');
  if (!split) {
    return;
  }

  split.querySelectorAll<HTMLElement>('.rd-meta-diagram__block[data-component-type]').forEach((block) => {
    block.addEventListener('click', () => {
      const componentType = block.dataset.componentType;
      if (componentType) {
        navigateToPaletteComponent(componentType);
      }
    });
  });

  wirePaletteLinks(root, split);

  split.querySelectorAll<HTMLElement>('.rd-meta-composition__item').forEach((item) => {
    const label = item.querySelector<HTMLElement>('.rd-meta-composition__item-label');
    const componentType = item.dataset.componentType;
    if (!label || !componentType) {
      return;
    }

    label.tabIndex = 0;
    label.setAttribute('role', 'link');
    label.setAttribute('title', `Open ${componentType} in palette`);

    const openPalette = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      navigateToPaletteComponent(componentType);
    };

    label.addEventListener('click', openPalette);
    label.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        openPalette(event);
      }
    });
  });

  split.querySelectorAll<HTMLElement>('.rd-meta-composition__xml-item').forEach((item) => {
    const label = item.querySelector<HTMLElement>('.rd-meta-composition__xml-item-label');
    const componentType = item.dataset.componentType;
    if (!label || !componentType) {
      return;
    }

    label.tabIndex = 0;
    label.setAttribute('role', 'link');
    label.setAttribute('title', `Open ${componentType} in palette`);

    const openPalette = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      navigateToPaletteComponent(componentType);
    };

    label.addEventListener('click', openPalette);
    label.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        openPalette(event);
      }
    });
  });
}

/** Mount a live meta composition with diagram, preview, and component XML panels. */
export function mountMetaComposition(definition: MetaCompositionDefinition): HTMLElement {
  const root = document.createElement('article');
  root.className = 'rd-meta-composition';
  root.dataset.compositionId = definition.id;

  const header = document.createElement('header');
  header.className = 'rd-meta-composition__header';
  header.innerHTML = `<h2 class="rd-meta-composition__title">${esc(definition.title)}</h2>
    <p class="rd-meta-composition__summary">${esc(definition.summary)}</p>
    <p class="rd-meta-composition__meta">${definition.componentTypes.length} component types · diagram + live preview + component XML</p>`;
  root.appendChild(header);

  const workspace = document.createElement('div');
  workspace.className = 'rd-meta-composition__workspace';
  workspace.dataset.activeView = 'visual';
  workspace.dataset.visualFocus = 'diagram';

  const tabstrip = document.createElement('nav');
  tabstrip.className = 'rd-meta-composition__tabstrip';
  tabstrip.setAttribute('role', 'tablist');
  tabstrip.setAttribute('aria-label', 'Composition panels');
  tabstrip.innerHTML = `<button type="button" class="rd-meta-composition__panel-tab" role="tab" data-view="diagram" aria-selected="true">Layout diagram</button>
    <button type="button" class="rd-meta-composition__panel-tab" role="tab" data-view="live" aria-selected="false" tabindex="-1">Live preview</button>
    <button type="button" class="rd-meta-composition__panel-tab" role="tab" data-view="xml" aria-selected="false" tabindex="-1">Component XML</button>`;
  workspace.appendChild(tabstrip);

  const split = document.createElement('div');
  split.className = 'rd-meta-composition__split';

  const diagramAside = document.createElement('aside');
  diagramAside.className = 'rd-meta-composition__diagram';
  diagramAside.setAttribute('aria-label', 'Layout diagram');
  diagramAside.innerHTML = renderCompositionDiagram(definition);
  split.appendChild(diagramAside);

  split.appendChild(buildLivePanel(definition));
  split.appendChild(buildXmlPanel(definition));
  workspace.appendChild(split);
  root.appendChild(workspace);

  wireCatalogInteractivity(root);
  wireDiagramHover(root);
  wireMetaCompositionNavigation(root);
  wireMetaCompositionPanels(root);
  return root;
}

/** Coverage matrix — proves every palette + npm atom appears in at least one composition. */
export function mountMetaCompositionCoverage(): HTMLElement {
  const covered = new Set<string>();
  for (const composition of META_COMPOSITIONS) {
    for (const type of composition.componentTypes) {
      covered.add(type);
    }
    for (const section of composition.sections) {
      for (const item of section.items) {
        covered.add(item);
      }
    }
  }

  const missing = uncoveredPaletteTypes();
  const root = document.createElement('article');
  root.className = 'rd-meta-composition rd-meta-composition--coverage';

  const npmRows = NPM_ATOM_IDS.map(
    (id) =>
      `<tr><td><button type="button" class="rd-meta-composition__coverage-link" data-nav-component-type="${esc(id)}"><code>${esc(id)}</code></button></td><td>${covered.has(id) ? '✓' : '—'}</td><td>${renderCoverageCompositionLinks(META_COMPOSITIONS.filter((c) => c.sections.some((s) => s.items.includes(id))))}</td></tr>`,
  ).join('');

  const paletteRows = ALL_PALETTE_TYPES.map((type) => {
    const comps = META_COMPOSITIONS.filter(
      (c) => c.componentTypes.includes(type) || c.sections.some((s) => s.items.includes(type)),
    );
    return `<tr><td><button type="button" class="rd-meta-composition__coverage-link" data-nav-component-type="${esc(type)}"><code>${esc(type)}</code></button></td><td>${covered.has(type) ? '✓' : '✗'}</td><td>${renderCoverageCompositionLinks(comps)}</td></tr>`;
  }).join('');

  root.innerHTML = `
    <header class="rd-meta-composition__header">
      <h2 class="rd-meta-composition__title">Component coverage audit</h2>
      <p class="rd-meta-composition__summary">
        Every builder palette type and shipped npm atom must appear in at least one meta composition.
        ${missing.length === 0 ? '<strong>All palette types covered.</strong>' : `<strong>Missing: ${missing.map(esc).join(', ')}</strong>`}
      </p>
    </header>
    <section class="rd-meta-composition__section">
      <h3 class="rd-meta-composition__section-title">Palette taxonomy (${ALL_PALETTE_TYPES.length})</h3>
      <div class="rd-meta-composition__coverage-table-wrap">
        <table class="rd-meta-composition__coverage-table">
          <thead><tr><th>Type</th><th>Covered</th><th>Compositions</th></tr></thead>
          <tbody>${paletteRows}</tbody>
        </table>
      </div>
    </section>
    <section class="rd-meta-composition__section">
      <h3 class="rd-meta-composition__section-title">NPM atoms (${NPM_ATOM_IDS.length})</h3>
      <div class="rd-meta-composition__coverage-table-wrap">
        <table class="rd-meta-composition__coverage-table">
          <thead><tr><th>Atom</th><th>Covered</th><th>Compositions</th></tr></thead>
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

function renderCoverageCompositionLinks(
  compositions: typeof META_COMPOSITIONS,
): string {
  if (compositions.length === 0) {
    return '—';
  }
  return compositions
    .map((composition) => {
      const label = META_COMPOSITION_STORY_NAMES[composition.id] ?? composition.title;
      return `<button type="button" class="rd-meta-composition__coverage-composition-link" data-nav-meta-composition="${esc(composition.id)}">${esc(label)}</button>`;
    })
    .join(' ');
}

export { META_COMPOSITIONS };
