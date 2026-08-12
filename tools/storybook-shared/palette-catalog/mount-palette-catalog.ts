import {
  DEFAULT_GLTF_MODEL_URL,
  DEFAULT_GLOBE_TEXTURE_URL,
  resolvePaletteGroups,
  type ResolvedPaletteGroup,
} from '@rosettadash/core';
import { linkTo } from '@storybook/addon-links';
import { ThreePreviewRuntime, type ThreeVisualMode } from '../../../apps/client/src/app/builder/preview/three-preview-runtime.js';
import { chartPoints, newsRows, tableRows } from './palette-demo-data.js';
import { catalogItemFooter, renderPaletteDemo } from './palette-demos.js';
import {
  getGroupGuide,
  PALETTE_GROUP_STORY_NAMES,
  renderComponentLearnMore,
  renderGroupGuideHtml,
} from './palette-group-guides.js';
import { renderComponentSpecHtml } from './component-catalog-spec.js';

const STORY_TITLE = 'Catalog/Palette';

const threeRuntimes = new WeakMap<HTMLElement, ThreePreviewRuntime>();
const timerHandles = new WeakMap<HTMLElement, number>();

function navigateToGroup(groupId: string): void {
  const storyName = PALETTE_GROUP_STORY_NAMES[groupId];
  if (storyName) {
    linkTo(STORY_TITLE, storyName)();
  }
}

function wireGroupNavigation(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-nav-group]').forEach((el) => {
    if (el.classList.contains('rd-catalog-item')) {
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

  root.querySelectorAll<HTMLElement>('.rd-catalog-item[data-nav-group]').forEach((item) => {
    const header = item.querySelector('.rd-catalog-item__header');
    const jump = item.querySelector('.rd-catalog-item__jump');
    const handler = (event: Event) => {
      event.preventDefault();
      const groupId = item.getAttribute('data-nav-group');
      if (groupId) {
        navigateToGroup(groupId);
      }
    };
    header?.addEventListener('click', handler);
    jump?.addEventListener('click', handler);
  });
}

function detailFieldsHtml(row: Record<string, string | number>): string {
  return Object.entries(row)
    .map(
      ([key, value]) =>
        `<div class="preview-detail__field"><dt>${key}</dt><dd>${String(value)}</dd></div>`,
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
    const id = window.setInterval(() => {
      ticks += 1;
      if (display) {
        display.textContent = `${ticks} ticks`;
      }
    }, 1200);
    timerHandles.set(block as HTMLElement, id);
  });
}

function initThreeHost(host: HTMLElement): void {
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
  root.querySelectorAll<HTMLElement>('.preview-three-host').forEach((host) => {
    initThreeHost(host);
  });
}

function wireCatalogInteractivity(root: HTMLElement): void {
  wireTableDetail(root);
  wireNewsDetail(root);
  wireTimePresets(root);
  wireTabs(root);
  wireCollapsible(root);
  wireTimers(root);
  wireThreeDemos(root);
  wireGroupNavigation(root);
}

interface RenderCatalogOptions {
  /** In All components view — clicking a card opens the group story */
  linkItemsToGroup?: boolean;
  /** Show group name as h2 in guide (group story pages) */
  showGuideTitle?: boolean;
  /** Two-column layout: guide left, components right */
  columnLayout?: boolean;
}

function renderCatalogItem(
  definition: ResolvedPaletteGroup['items'][number],
  group: ResolvedPaletteGroup,
  options: RenderCatalogOptions,
): string {
  const linkAttrs = options.linkItemsToGroup ? ` data-nav-group="${group.id}"` : '';
  const jumpBtn = options.linkItemsToGroup
    ? `<button type="button" class="rd-catalog-item__jump" data-nav-group="${group.id}">Open ${group.label} →</button>`
    : '';
  const headerClass = options.linkItemsToGroup ? ' rd-catalog-item__header--linkable' : '';
  const specHtml = renderComponentSpecHtml(definition);

  return `<article class="rd-catalog-item${options.linkItemsToGroup ? ' rd-catalog-item--linkable' : ''}" data-component-type="${definition.type}"${linkAttrs}>
    <header class="rd-catalog-item__header${headerClass}">
      <h3>${definition.label}</h3>
      <p>${definition.description ?? ''}</p>
      ${jumpBtn}
    </header>
    ${specHtml}
    <div class="rd-catalog-item__demo">${renderPaletteDemo(definition.type, definition)}</div>
    ${renderComponentLearnMore(definition.type)}
    ${catalogItemFooter(definition)}
  </article>`;
}

function renderCatalogGroup(group: ResolvedPaletteGroup, options: RenderCatalogOptions = {}): string {
  const useColumns = options.columnLayout ?? true;
  const guide = getGroupGuide(group.id);
  const guideHtml = guide
    ? renderGroupGuideHtml(guide, { showTitle: options.showGuideTitle ?? true })
    : `<p class="rd-catalog__intro">${group.items.length} components in <strong>${group.label}</strong>.</p>`;

  const items = group.items.map((definition) => renderCatalogItem(definition, group, options)).join('');

  const sectionTitle =
    options.linkItemsToGroup && options.showGuideTitle === false
      ? `<h2 class="rd-catalog-section-title">${group.label}</h2>`
      : '';

  const itemsBlock = `<div class="rd-catalog__items">${items}</div>`;

  if (useColumns) {
    return `<div class="rd-catalog rd-catalog--columns" data-catalog-group="${group.id}">
      ${sectionTitle}
      <div class="rd-catalog-layout">
        <aside class="rd-catalog-layout__guide">${guideHtml}</aside>
        <div class="rd-catalog-layout__panel">${itemsBlock}</div>
      </div>
    </div>`;
  }

  return `<div class="rd-catalog" data-catalog-group="${group.id}">
    ${sectionTitle}
    ${guideHtml}
    ${itemsBlock}
  </div>`;
}

/** Mount a full palette group catalog page. */
export function mountPaletteCatalog(groupId: string): HTMLElement {
  const group = resolvePaletteGroups().find((entry) => entry.id === groupId);
  if (!group) {
    const fallback = document.createElement('p');
    fallback.textContent = `Unknown palette group: ${groupId}`;
    return fallback;
  }

  const root = document.createElement('div');
  root.innerHTML = renderCatalogGroup(group, {
    showGuideTitle: true,
    linkItemsToGroup: false,
    columnLayout: true,
  });
  wireCatalogInteractivity(root);
  return root;
}

/** Master index — every group on one page; click any component to open its group story. */
export function mountFullPaletteCatalog(): HTMLElement {
  const groups = resolvePaletteGroups();
  const root = document.createElement('div');
  root.className = 'rd-catalog-master';
  root.innerHTML = `<div class="rd-catalog-guide rd-catalog-guide--master">
    <h2 class="rd-catalog-guide__title">All palette components</h2>
    <p class="rd-catalog-guide__summary">Every component from the builder sidebar, grouped below. <strong>Click any component card</strong> (or “Open … →”) to jump to that group’s dedicated page with full section guidance.</p>
  </div>`;

  for (const group of groups) {
    const section = document.createElement('section');
    section.id = `catalog-${group.id}`;
    section.innerHTML = renderCatalogGroup(group, {
      showGuideTitle: false,
      linkItemsToGroup: true,
      columnLayout: true,
    });
    wireCatalogInteractivity(section);
    root.appendChild(section);
  }

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
