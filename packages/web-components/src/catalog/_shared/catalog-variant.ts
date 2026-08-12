/** Visual density / chrome for catalog meta elements — shared across runtimes via BEM modifiers. */
export type CatalogVariant = 'default' | 'compact' | 'plain';

export const CATALOG_VARIANTS: CatalogVariant[] = ['default', 'compact', 'plain'];

export function readCatalogVariant(value: string | null, fallback: CatalogVariant = 'default'): CatalogVariant {
  if (value === 'compact' || value === 'plain' || value === 'default') {
    return value;
  }
  return fallback;
}

export function applyCatalogVariant(el: HTMLElement, blockClass: string, variant: CatalogVariant): void {
  el.classList.add(blockClass);
  for (const name of CATALOG_VARIANTS) {
    if (name !== 'default') {
      el.classList.remove(`${blockClass}--${name}`);
    }
  }
  if (variant !== 'default') {
    el.classList.add(`${blockClass}--${variant}`);
  }
}
