import type { ComponentDefinition, ResolvedPaletteGroup } from '@rosettadash/core';
import {
  createComponentNameElement,
  createPaletteCatalogElement,
  createPaletteGroupElement,
  registerRosettaDashCatalogElements,
  type CatalogVariant,
} from '@rosettadash/web-components/catalog';
import {
  getComponentCatalogAssumptions,
  getComponentCatalogExtras,
} from './component-catalog-spec.js';
import {
  getGroupGuide,
  PALETTE_GROUP_STORY_NAMES,
  renderRelatedGroupButtonsHtml,
} from './palette-group-guides.js';
import { renderPaletteDemo } from './palette-demos.js';

let catalogElementsRegistered = false;

export function ensureCatalogElementsRegistered(): void {
  if (!catalogElementsRegistered) {
    registerRosettaDashCatalogElements();
    catalogElementsRegistered = true;
  }
}

export interface BuildCatalogGroupOptions {
  variant?: CatalogVariant;
  linkItemsToGroup?: boolean;
  showGuideTitle?: boolean;
  columnLayout?: boolean;
}

function buildComponentName(
  definition: ComponentDefinition,
  group: ResolvedPaletteGroup,
  options: BuildCatalogGroupOptions,
): HTMLElement {
  const extras = getComponentCatalogExtras(definition.type);
  const assumptions = getComponentCatalogAssumptions(definition.type, definition);

  const component = createComponentNameElement(definition, {
    variant: options.variant ?? 'default',
    dependencies: extras.dependencies,
    assumptions,
    subcomponents: extras.subcomponents,
    navGroupId: options.linkItemsToGroup ? group.id : undefined,
  });

  const demo = document.createElement('div');
  demo.slot = 'demo';
  demo.className = 'rd-catalog-item__demo';
  demo.innerHTML = renderPaletteDemo(definition.type, definition);
  component.appendChild(demo);

  const footer = document.createElement('footer');
  footer.slot = 'footer';
  footer.className = 'rd-catalog-item__footer';
  footer.innerHTML = `<span class="rd-catalog-item__type">${definition.type}</span><span>${definition.category}${definition.isVisual ? '' : ' · non-visual'}</span>`;
  component.appendChild(footer);

  if (options.linkItemsToGroup) {
    const jump = document.createElement('button');
    jump.type = 'button';
    jump.className = 'rd-catalog-item__jump';
    jump.setAttribute('data-nav-group', group.id);
    jump.textContent = `Open ${group.label} →`;
    jump.addEventListener('click', (event) => {
      event.stopPropagation();
    });
    component.appendChild(jump);
  }

  return component;
}

function buildGuideElement(
  group: ResolvedPaletteGroup,
  options: BuildCatalogGroupOptions,
): HTMLElement {
  const guide = getGroupGuide(group.id);
  if (!guide) {
    const fallback = document.createElement('p');
    fallback.className = 'rd-catalog__intro';
    fallback.innerHTML = `${group.items.length} components in <strong>${group.label}</strong>.`;
    return fallback;
  }

  const relatedHtml = renderRelatedGroupButtonsHtml(guide.relatedGroupIds);

  return createPaletteGroupElement({
    groupId: group.id,
    label: PALETTE_GROUP_STORY_NAMES[guide.id] ?? group.label,
    fit: guide.fit,
    summary: guide.summary,
    relationships: guide.relationships,
    learnMore: guide.learnMore,
    relatedButtonsHtml: relatedHtml || undefined,
    variant: options.variant ?? 'default',
    showTitle: options.showGuideTitle ?? true,
  });
}

/** Build a palette group page as `rd-palette-catalog` custom element tree. */
export function buildCatalogGroupElement(
  group: ResolvedPaletteGroup,
  options: BuildCatalogGroupOptions = {},
): HTMLElement {
  ensureCatalogElementsRegistered();

  const specs = group.items.map((definition) => buildComponentName(definition, group, options));
  const guide = buildGuideElement(group, options);

  const title =
    options.linkItemsToGroup && options.showGuideTitle === false
      ? (() => {
          const h2 = document.createElement('h2');
          h2.slot = 'title';
          h2.className = 'rd-catalog-section-title';
          h2.textContent = group.label;
          return h2;
        })()
      : undefined;

  return createPaletteCatalogElement({
    groupId: group.id,
    variant: options.variant ?? 'default',
    columns: options.columnLayout ?? true,
    guide,
    title,
    specs,
  });
}
