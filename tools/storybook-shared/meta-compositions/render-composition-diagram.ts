import { defaultComponentRegistry } from '@rosettadash/core';
import type { MetaCompositionDefinition, MetaCompositionSection } from './composition-definitions.js';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function itemLabel(itemId: string): string {
  if (itemId.startsWith('npm.')) {
    return itemId.replace('npm.rd-', '<rd-').replace('npm.', '') + (itemId.includes('rd-') ? '>' : '');
  }
  return defaultComponentRegistry.get(itemId)?.label ?? itemId;
}

function itemShortType(itemId: string): string {
  if (itemId.startsWith('npm.')) {
    return itemId.replace('npm.', '');
  }
  return itemId.split('.').slice(-2).join('.');
}

function renderDiagramSection(
  section: MetaCompositionSection,
  sectionIndex: number,
): string {
  const layout = section.layout ?? 'stack';

  const blockHtml = (itemId: string, itemIndex: number) =>
    `<div class="rd-meta-diagram__block" data-diagram-target="s${sectionIndex}-i${itemIndex}" data-component-type="${esc(itemId)}" title="${esc(itemId)}">
          <span class="rd-meta-diagram__block-label">${esc(itemLabel(itemId))}</span>
          <span class="rd-meta-diagram__block-type">${esc(itemShortType(itemId))}</span>
        </div>`;

  const flowHtml = `<div class="rd-meta-diagram__flow" aria-hidden="true"><span class="rd-meta-diagram__flow-arrow">→</span></div>`;

  let itemsInner = '';
  if (layout === 'split' && section.items.length === 2) {
    itemsInner = `${blockHtml(section.items[0], 0)}${flowHtml}${blockHtml(section.items[1], 1)}`;
  } else {
    itemsInner = section.items.map((itemId, itemIndex) => blockHtml(itemId, itemIndex)).join('');
  }

  const itemsClass =
    layout === 'split' && section.items.length === 2
      ? 'rd-meta-diagram__items rd-meta-diagram__items--split'
      : layout === 'gallery'
        ? 'rd-meta-diagram__items rd-meta-diagram__items--gallery'
        : layout === 'grid'
          ? 'rd-meta-diagram__items rd-meta-diagram__items--grid'
          : 'rd-meta-diagram__items rd-meta-diagram__items--stack';

  return `<div class="rd-meta-diagram__section rd-meta-diagram__section--${layout}">
    <div class="rd-meta-diagram__section-label">${esc(section.title)}</div>
    <div class="${itemsClass}">${itemsInner}</div>
  </div>`;
}

/** Schematic layout diagram for a meta composition. */
export function renderCompositionDiagram(definition: MetaCompositionDefinition): string {
  const sections = definition.sections
    .map((section, index) => renderDiagramSection(section, index))
    .join('');

  return `<div class="rd-meta-diagram" role="img" aria-label="Layout diagram for ${esc(definition.title)}">
    <p class="rd-meta-diagram__hint">Hover any block to highlight matching live preview and XML. <strong>Click a block, label, or Palette →</strong> to open its palette detail.</p>
    ${sections}
  </div>`;
}
