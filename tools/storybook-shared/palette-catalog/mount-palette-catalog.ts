import {
  DEFAULT_GLTF_MODEL_URL,
  DEFAULT_GLOBE_TEXTURE_URL,
  findPaletteGroupIdForType,
  resolvePaletteGroups,
  type ResolvedPaletteGroup,
} from '@rosettadash/core';
import { linkTo } from '@storybook/addon-links';
import { ThreePreviewRuntime, type ThreeVisualMode } from '../../../apps/client/src/app/builder/preview/three-preview-runtime.js';
import {
  documentationTocItemsJson,
  externalResourceItemsJson,
  navigationLinkItemsJson,
} from '../fixtures.js';
import { isNumericDetailKey } from '../preview-numeric.js';
import { chartPoints, newsRows, tableRows } from './palette-demo-data.js';
import { buildCatalogGroupElement, ensureCatalogElementsRegistered } from './build-palette-catalog-ce.js';
import {
  getGroupGuide,
  PALETTE_GROUP_STORY_IDS,
  PALETTE_GROUP_STORY_NAMES,
} from './palette-group-guides.js';

const STORY_TITLE = 'Catalog/Components';
const NPM_LAYOUT_ATOMS_STORY = 'NPM layout atoms (rd-*)';
const CATALOG_SCROLL_KEY = 'rosettadash:catalog-scroll-target';

const threeRuntimes = new WeakMap<HTMLElement, ThreePreviewRuntime>();
const timerHandles = new WeakMap<HTMLElement, number>();

function setCatalogScrollTarget(componentType: string): void {
  try {
    sessionStorage.setItem(CATALOG_SCROLL_KEY, componentType);
  } catch {
    // sessionStorage unavailable in some embed contexts
  }
}

function consumeCatalogScrollTarget(): string | null {
  try {
    const value = sessionStorage.getItem(CATALOG_SCROLL_KEY);
    if (value) {
      sessionStorage.removeItem(CATALOG_SCROLL_KEY);
    }
    return value;
  } catch {
    return null;
  }
}

function findCatalogComponentTarget(root: HTMLElement, componentType: string): HTMLElement | null {
  const escaped = CSS.escape(componentType);
  return (
    root.querySelector<HTMLElement>(`[data-catalog-component="${escaped}"]`) ??
    root.querySelector<HTMLElement>(`rd-component-name[component-type="${escaped}"]`)
  );
}

function highlightCatalogTarget(target: HTMLElement): void {
  target.classList.add('rd-catalog-item--deep-link-target');
  window.setTimeout(() => target.classList.remove('rd-catalog-item--deep-link-target'), 2500);
}

function applyPendingCatalogScroll(root: HTMLElement): void {
  const componentType = consumeCatalogScrollTarget();
  if (!componentType) {
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = findCatalogComponentTarget(root, componentType);
      if (!target) {
        return;
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      highlightCatalogTarget(target);
    });
  });
}

function navigateStorybookToStory(storyId: string): void {
  const targetWindow = window.top ?? window;
  const url = new URL(targetWindow.location.href);
  url.searchParams.set('path', `/story/${storyId}`);
  targetWindow.location.href = url.toString();
}

/** Navigate from meta composition (or elsewhere) to a palette component detail page. */
export function navigateToPaletteComponent(componentType: string): void {
  setCatalogScrollTarget(componentType);

  if (componentType.startsWith('npm.')) {
    linkTo(STORY_TITLE, NPM_LAYOUT_ATOMS_STORY)();
    return;
  }

  const groupId = findPaletteGroupIdForType(componentType);
  if (!groupId) {
    return;
  }

  const storyName = PALETTE_GROUP_STORY_NAMES[groupId];
  const storyId = PALETTE_GROUP_STORY_IDS[groupId];

  if (storyName) {
    linkTo(STORY_TITLE, storyName)();
    return;
  }

  if (storyId) {
    navigateStorybookToStory(storyId);
  }
}

function navigateToGroup(groupId: string): void {
  const storyName = PALETTE_GROUP_STORY_NAMES[groupId];
  if (storyName) {
    linkTo(STORY_TITLE, storyName)();
  }
}

function wireGroupNavigation(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-nav-group]').forEach((el) => {
    if (el.tagName.toLowerCase() === 'rd-component-spec') {
      return;
    }
    el.addEventListener('click', (event) => {
      event.preventDefault();
      const groupId = el.getAttribute('data-nav-group');
      if (groupId) {
        navigateToGroup(groupId);
      }
    });
  });

  root.querySelectorAll<HTMLElement>('rd-component-name[nav-group-id]').forEach((spec) => {
    const groupId = spec.getAttribute('nav-group-id');
    if (!groupId) {
      return;
    }
    spec.setAttribute('data-nav-group', groupId);

    const handler = (event: Event) => {
      const path = event.composedPath();
      const inDemo = path.some(
        (node) =>
          node instanceof HTMLElement &&
          (node.classList.contains('rd-catalog-item__demo') || node.slot === 'demo'),
      );
      if (inDemo) {
        return;
      }
      event.preventDefault();
      navigateToGroup(groupId);
    };

    spec.addEventListener('click', handler);
  });

  root.querySelectorAll<HTMLElement>('rd-component-spec[nav-group-id]').forEach((spec) => {
    const groupId = spec.getAttribute('nav-group-id');
    if (!groupId) {
      return;
    }
    spec.setAttribute('data-nav-group', groupId);

    const handler = (event: Event) => {
      const path = event.composedPath();
      const inDemo = path.some(
        (node) =>
          node instanceof HTMLElement &&
          (node.classList.contains('rd-catalog-item__demo') ||
            node.slot === 'demo' ||
            node.closest?.('.rd-catalog-item__demo') !== null),
      );
      if (inDemo) {
        return;
      }
      const onJump = path.some(
        (node) =>
          node instanceof HTMLElement &&
          (node.classList.contains('rd-catalog-item__jump') ||
            node.classList.contains('rd-component-spec__header') ||
            node.classList.contains('rd-component-spec__header--linkable')),
      );
      if (!onJump && event.target !== spec) {
        return;
      }
      event.preventDefault();
      navigateToGroup(groupId);
    };

    spec.addEventListener('click', handler);
    spec.shadowRoot?.querySelector('.rd-component-spec__header')?.addEventListener('click', handler);
    spec.querySelector('[slot="jump"]')?.addEventListener('click', handler);
  });
}

function detailFieldsHtml(row: Record<string, string | number>): string {
  return Object.entries(row)
    .map(
      ([key, value]) =>
        `<div class="preview-detail__field"><dt>${key}</dt><dd${isNumericDetailKey(key) ? ' class="preview-detail__value--numeric"' : ''}>${String(value)}</dd></div>`,
    )
    .join('');
}

function wireTableDetail(root: HTMLElement): void {
  const table = root.querySelector('[data-catalog-table]');
  const detail = root.querySelector('[data-catalog-detail]');
  if (!table || !detail) {
    return;
  }

  table.querySelectorAll('[data-row-id]').forEach((rowEl) => {
    rowEl.addEventListener('click', () => {
      table.querySelectorAll('.preview-table__row--selected').forEach((el) => {
        el.classList.remove('preview-table__row--selected');
      });
      rowEl.classList.add('preview-table__row--selected');
      const id = rowEl.getAttribute('data-row-id');
      const row = tableRows.find((r) => r.id === id);
      if (!row) {
        return;
      }
      detail.innerHTML = `<div class="preview-detail__header"><span class="preview-detail__title">Details</span><span class="preview-chip">Row ${row.id}</span></div><dl class="preview-detail__fields">${detailFieldsHtml(row)}</dl>`;
      table.dispatchEvent(
        new CustomEvent('rd-table-row-select', {
          bubbles: true,
          composed: true,
          detail: { rowId: row.id, name: row.name },
        }),
      );
    });
  });
}

function wireNewsDetail(root: HTMLElement): void {
  const table = root.querySelector('[data-catalog-news-table]');
  const detail = root.querySelector('[data-catalog-news-detail]');
  if (!table || !detail) {
    return;
  }

  table.querySelectorAll('[data-news-id]').forEach((rowEl) => {
    rowEl.addEventListener('click', () => {
      table.querySelectorAll('.preview-table__row--selected').forEach((el) => {
        el.classList.remove('preview-table__row--selected');
      });
      rowEl.classList.add('preview-table__row--selected');
      const id = rowEl.getAttribute('data-news-id');
      const row = newsRows.find((r) => r.id === id);
      if (!row) {
        return;
      }
      detail.innerHTML = `<div class="preview-detail__header"><span class="preview-detail__title">${row.headline}</span><span class="preview-chip">${row.source}</span></div><dl class="preview-detail__fields">${detailFieldsHtml({ summary: row.summary, region: row.region, published: row.publishedAt, url: row.url })}</dl>`;
    });
  });
}

function wireTimePresets(root: HTMLElement): void {
  root.querySelectorAll('[data-catalog-time-preset]').forEach((block) => {
    block.querySelectorAll('[data-preset]').forEach((button) => {
      button.addEventListener('click', () => {
        block.querySelectorAll('.preview-time-preset__button--active').forEach((el) => {
          el.classList.remove('preview-time-preset__button--active');
        });
        button.classList.add('preview-time-preset__button--active');
      });
    });
  });
}

function wireTabs(root: HTMLElement): void {
  root.querySelectorAll('[data-catalog-tabs]').forEach((block) => {
    const panel = block.querySelector('[data-tab-panel]');
    const labels = ['Overview panel — summary KPIs and filters', 'Metrics panel — charts bound to date range', 'Settings panel — layout and export targets'];
    block.querySelectorAll('[data-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        block.querySelectorAll('.preview-tabs__tab--active').forEach((el) => {
          el.classList.remove('preview-tabs__tab--active');
        });
        tab.classList.add('preview-tabs__tab--active');
        const index = Number(tab.getAttribute('data-tab') ?? 0);
        if (panel) {
          panel.textContent = labels[index] ?? labels[0];
        }
      });
    });
  });
}

function wireCollapsible(root: HTMLElement): void {
  root.querySelectorAll('[data-catalog-collapsible]').forEach((block) => {
    const header = block.querySelector('.preview-collapsible__header');
    const panel = block.querySelector('.preview-collapsible__panel');
    header?.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (panel) {
        panel.hidden = expanded;
      }
    });
  });
}

function wireTimers(root: HTMLElement): void {
  root.querySelectorAll('[data-catalog-timer]').forEach((block) => {
    let ticks = 0;
    const display = block.querySelector('[data-timer-display]');
    const intervalMs = Number((block as HTMLElement).dataset.intervalMs ?? 1200);
    const id = window.setInterval(() => {
      ticks += 1;
      if (display) {
        display.textContent = `${ticks} ticks`;
      }
    }, Math.max(400, intervalMs));
    timerHandles.set(block as HTMLElement, id);
  });
}

function initThreeHost(host: HTMLElement): void {
  if (threeRuntimes.has(host)) {
    return;
  }

  const mode = host.getAttribute('data-three-mode') as ThreeVisualMode | null;
  if (!mode) {
    return;
  }

  const runtime = new ThreePreviewRuntime();
  runtime.mount(host);
  threeRuntimes.set(host, runtime);

  runtime.update(
    {
      backgroundColor: '#0f172a',
      cameraPreset: 'iso',
      autoRotate: mode === 'gltf-model' || mode === 'geo-globe',
      showGrid: mode !== 'geo-globe',
    },
    {
      mode,
      points: chartPoints,
      scatterPoints: tableRows.map((row, index) => ({
        id: row.id,
        x: index,
        y: row.amount / 1000,
        z: index * 0.5,
        label: row.name,
      })),
      globeMarkers: tableRows.slice(0, 4).map((row, index) => ({
        id: row.id,
        label: row.name,
        lat: 20 + index * 12,
        lng: -120 + index * 35,
      })),
      gltfModel: { url: DEFAULT_GLTF_MODEL_URL, scale: 1.5 },
      globe: { textureUrl: DEFAULT_GLOBE_TEXTURE_URL, radius: 2.2 },
    },
  );
}

function wireThreeDemos(root: HTMLElement): void {
  const mountAll = () => {
    root.querySelectorAll<HTMLElement>('.preview-three-host').forEach((host) => {
      initThreeHost(host);
    });
  };

  // Storybook attaches the mount root after render — wait for layout before sizing canvases.
  requestAnimationFrame(() => requestAnimationFrame(mountAll));
}

export function wireCatalogInteractivity(root: HTMLElement): void {
  wireTableDetail(root);
  wireNewsDetail(root);
  wireTimePresets(root);
  wireTabs(root);
  wireCollapsible(root);
  wireTimers(root);
  wireThreeDemos(root);
  wireGroupNavigation(root);
}

/** Shipped npm custom elements not duplicated in builder palette rows. */
export function mountNpmLayoutAtoms(): HTMLElement {
  const root = document.createElement('div');
  root.className = 'rd-catalog';
  root.innerHTML = `
    <p class="rd-catalog__intro">Shipped npm custom elements — compose with catalog atoms above.</p>
    <article class="rd-catalog-item" data-catalog-component="npm.rd-accordion"><header class="rd-catalog-item__header"><h3>Accordion</h3><p>layout/accordion — <code>&lt;rd-accordion&gt;</code></p></header>
      <div class="rd-catalog-item__demo"><rd-accordion heading="Resources" default-open><p>Slot content for filters, copy, or nested lists.</p></rd-accordion></div></article>
    <article class="rd-catalog-item" data-catalog-component="npm.rd-link-list"><header class="rd-catalog-item__header"><h3>Link List</h3><p>visual/link-list — JSON <code>items</code> array</p></header>
      <div class="rd-catalog-item__demo"><rd-link-list items='${navigationLinkItemsJson}'></rd-link-list></div></article>
    <article class="rd-catalog-item" data-catalog-component="npm.rd-accordion-link-list"><header class="rd-catalog-item__header"><h3>Accordion Link List</h3><p>Recipe — collapsible TOC</p></header>
      <div class="rd-catalog-item__demo"><rd-accordion-link-list heading="On this page" default-open items='${documentationTocItemsJson}'></rd-accordion-link-list></div></article>
    <article class="rd-catalog-item"><header class="rd-catalog-item__header"><h3>External links (dense)</h3></header>
      <div class="rd-catalog-item__demo"><rd-link-list dense items='${externalResourceItemsJson}'></rd-link-list></div></article>
  `;
  applyPendingCatalogScroll(root);
  return root;
}

/** Mount a full palette group catalog page. */
export function mountPaletteCatalog(groupId: string): HTMLElement {
  ensureCatalogElementsRegistered();
  const group = resolvePaletteGroups().find((entry) => entry.id === groupId);
  if (!group) {
    const fallback = document.createElement('p');
    fallback.textContent = `Unknown palette group: ${groupId}`;
    return fallback;
  }

  const root = buildCatalogGroupElement(group, {
    showGuideTitle: true,
    linkItemsToGroup: false,
    columnLayout: true,
  });
  wireCatalogInteractivity(root);
  applyPendingCatalogScroll(root);
  return root;
}

/** Master index — every group on one page; click any component to open its group story. */
export function mountFullPaletteCatalog(): HTMLElement {
  ensureCatalogElementsRegistered();
  const groups = resolvePaletteGroups();
  const root = document.createElement('div');
  root.className = 'rd-catalog-master';

  const intro = document.createElement('div');
  intro.className = 'rd-catalog-guide rd-catalog-guide--master';
  intro.innerHTML = `<h2 class="rd-catalog-guide__title">All palette components</h2>
    <p class="rd-catalog-guide__summary">Every component from the builder sidebar, grouped below. <strong>Click any component header</strong> (or “Open … →”) to jump to that group’s dedicated page with full section guidance.</p>`;
  root.appendChild(intro);

  for (const group of groups) {
    const section = document.createElement('section');
    section.id = `catalog-${group.id}`;
    const catalog = buildCatalogGroupElement(group, {
      showGuideTitle: false,
      linkItemsToGroup: true,
      columnLayout: true,
    });
    section.appendChild(catalog);
    wireCatalogInteractivity(section);
    root.appendChild(section);
  }

  const npmSection = document.createElement('section');
  npmSection.id = 'catalog-npm-layout-atoms';
  const npmHeading = document.createElement('h2');
  npmHeading.className = 'rd-catalog-section-title';
  npmHeading.textContent = 'NPM layout atoms (rd-*)';
  npmSection.appendChild(npmHeading);
  npmSection.appendChild(mountNpmLayoutAtoms());
  root.appendChild(npmSection);

  wireGroupNavigation(root);
  return root;
}

export function disposePaletteCatalog(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('.preview-three-host').forEach((host) => {
    threeRuntimes.get(host)?.dispose();
    threeRuntimes.delete(host);
  });
  root.querySelectorAll<HTMLElement>('[data-catalog-timer]').forEach((block) => {
    const id = timerHandles.get(block);
    if (id !== undefined) {
      window.clearInterval(id);
      timerHandles.delete(block);
    }
  });
}

export { resolvePaletteGroups };
export type { ResolvedPaletteGroup };
