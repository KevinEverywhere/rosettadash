import { applyCatalogVariant, readCatalogVariant, type CatalogVariant } from '../_shared/catalog-variant.js';

/** Map taxonomy type to documented custom-element-style tag (rd-*). */
export function taxonomyToRdTag(componentType: string): string {
  const stripped = componentType.replace(/^(visual|domain|layout|logic|infra)\./, '');
  const kebab = stripped.replace(/\./g, '-');
  return `rd-${kebab}`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function readMarkupVariant(el: HTMLElement): CatalogVariant {
  return readCatalogVariant(el.getAttribute('variant'));
}

export function applyMarkupVariant(el: HTMLElement, blockClass: string): void {
  applyCatalogVariant(el, blockClass, readMarkupVariant(el));
}
