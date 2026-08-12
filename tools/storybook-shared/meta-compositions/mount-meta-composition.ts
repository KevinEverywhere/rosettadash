import { defaultComponentRegistry } from '@rosettadash/core';
import {
  documentationTocItemsJson,
  navigationLinkItemsJson,
} from '../fixtures.js';
import { wireCatalogInteractivity } from '../palette-catalog/mount-palette-catalog.js';
import { renderPaletteDemo } from '../palette-catalog/palette-demos.js';
import {
  ALL_PALETTE_TYPES,
  META_COMPOSITIONS,
  NPM_ATOM_IDS,
  type MetaCompositionDefinition,
  uncoveredPaletteTypes,
} from './composition-definitions.js';
import { renderCompositionDiagram } from './render-composition-diagram.js';

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

function renderItem(itemId: string): { label: string; html: string } {
  if (itemId.startsWith('npm.')) {
    const label = itemId.replace('npm.rd-', 'rd-').replace('npm.', '');
    return { label, html: renderNpmAtom(itemId) };
  }

  const definition = defaultComponentRegistry.get(itemId);
  if (!definition) {
    return {
      label: itemId,
      html: `<div class="preview-fallback"><span>Unknown type</span><code>${esc(itemId)}</code></div>`,
    };
  }

  return {
    label: definition.label,
    html: renderPaletteDemo(itemId, definition),
  };
}

function buildLivePanel(definition: MetaCompositionDefinition): HTMLElement {
  const live = document.createElement('div');
  live.className = 'rd-meta-composition__live';

  const liveTitle = document.createElement('h3');
  liveTitle.className = 'rd-meta-composition__panel-title';
  liveTitle.textContent = 'Live preview';
  live.appendChild(liveTitle);

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
      item.innerHTML = `<header class="rd-meta-composition__item-label">${esc(label)}</header>
        <div class="rd-meta-composition__item-demo">${html}</div>`;
      grid.appendChild(item);
    });

    live.appendChild(sectionEl);
  });

  return live;
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

  function clearHighlight(): void {
    for (const el of diagramBlocks()) {
      el.classList.remove('rd-meta-diagram__block--active');
    }
    for (const el of liveItems()) {
      el.classList.remove('rd-meta-composition__item--highlight');
    }
  }

  function highlight(target: string, scrollLive = false): void {
    clearHighlight();
    let liveMatch: HTMLElement | null = null;

    for (const el of diagramBlocks()) {
      if (el.dataset.diagramTarget === target) {
        el.classList.add('rd-meta-diagram__block--active');
      }
    }

    for (const el of liveItems()) {
      if (el.dataset.diagramTarget === target) {
        el.classList.add('rd-meta-composition__item--highlight');
        liveMatch = el;
      }
    }

    if (scrollLive && liveMatch) {
      liveMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
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
    highlight(target, fromDiagram);
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
        highlight(target, true);
      }
    });
    block.addEventListener('blur', () => {
      clearHighlight();
    });
  }
}

/** Mount a live meta composition with diagram + preview split. */
export function mountMetaComposition(definition: MetaCompositionDefinition): HTMLElement {
  const root = document.createElement('article');
  root.className = 'rd-meta-composition';
  root.dataset.compositionId = definition.id;

  const header = document.createElement('header');
  header.className = 'rd-meta-composition__header';
  header.innerHTML = `<h2 class="rd-meta-composition__title">${esc(definition.title)}</h2>
    <p class="rd-meta-composition__summary">${esc(definition.summary)}</p>
    <p class="rd-meta-composition__meta">${definition.componentTypes.length} component types · diagram + live preview</p>`;
  root.appendChild(header);

  const split = document.createElement('div');
  split.className = 'rd-meta-composition__split';

  const diagramAside = document.createElement('aside');
  diagramAside.className = 'rd-meta-composition__diagram';
  diagramAside.setAttribute('aria-label', 'Layout diagram');
  diagramAside.innerHTML = `<h3 class="rd-meta-composition__panel-title">Layout diagram</h3>${renderCompositionDiagram(definition)}`;
  split.appendChild(diagramAside);

  split.appendChild(buildLivePanel(definition));
  root.appendChild(split);

  wireCatalogInteractivity(root);
  wireDiagramHover(root);
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
      `<tr><td><code>${esc(id)}</code></td><td>${covered.has(id) ? '✓' : '—'}</td><td>${META_COMPOSITIONS.filter((c) => c.sections.some((s) => s.items.includes(id))).map((c) => c.title).join(', ') || '—'}</td></tr>`,
  ).join('');

  const paletteRows = ALL_PALETTE_TYPES.map((type) => {
    const comps = META_COMPOSITIONS.filter(
      (c) => c.componentTypes.includes(type) || c.sections.some((s) => s.items.includes(type)),
    );
    return `<tr><td><code>${esc(type)}</code></td><td>${covered.has(type) ? '✓' : '✗'}</td><td>${comps.map((c) => c.title).join(', ') || '—'}</td></tr>`;
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

  return root;
}

export { META_COMPOSITIONS };
