import { defineRosettaElement, readString } from '../lib/element-utils.js';
import { RD_COMPONENT_SPEC_TAG } from './component-spec.js';
import { RD_PALETTE_GROUP_TAG } from './palette-group.js';
import { applyCatalogVariant, readCatalogVariant, type CatalogVariant } from './catalog-variant.js';

export const RD_PALETTE_CATALOG_TAG = 'rd-palette-catalog';

export interface PaletteCatalogProps {
  groupId?: string;
  variant?: CatalogVariant;
  columns?: boolean;
}

export class RdPaletteCatalogElement extends HTMLElement {
  static readonly tagName = RD_PALETTE_CATALOG_TAG;

  static get observedAttributes(): string[] {
    return ['group-id', 'variant', 'columns'];
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.render();
  }

  attributeChangedCallback(): void {
    if (this.shadowRoot) {
      this.render();
    }
  }

  get groupId(): string {
    return readString(this.getAttribute('group-id'), '');
  }

  get variant(): CatalogVariant {
    return readCatalogVariant(this.getAttribute('variant'));
  }

  get columns(): boolean {
    return this.getAttribute('columns') !== 'false';
  }

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const layoutClass = this.columns ? ' rd-palette-catalog__layout--columns' : '';

    root.innerHTML = `
<style>
:host { display: block; }
.rd-palette-catalog {
  display: grid;
  gap: 1.25rem;
  max-width: 80rem;
  font-family: var(--rd-font-family, system-ui, sans-serif);
}
.rd-palette-catalog__layout {
  display: grid;
  gap: 1.25rem;
}
.rd-palette-catalog__layout--columns {
  grid-template-columns: minmax(16rem, 22rem) minmax(0, 1fr);
  gap: 1.5rem 2rem;
  align-items: start;
}
.rd-palette-catalog__guide {
  position: sticky;
  top: 1rem;
}
.rd-palette-catalog__items {
  display: grid;
  gap: 1.25rem;
  min-width: 0;
}
.rd-palette-catalog--compact .rd-palette-catalog__items { gap: 0.75rem; }
.rd-palette-catalog--plain .rd-palette-catalog__guide { position: static; }
@media (max-width: 768px) {
  .rd-palette-catalog__layout--columns {
    grid-template-columns: 1fr;
  }
  .rd-palette-catalog__guide { position: static; }
}
</style>
<div class="rd-palette-catalog" part="catalog" data-catalog-group="${escapeAttr(this.groupId)}">
  <slot name="title"></slot>
  <div class="rd-palette-catalog__layout${layoutClass}">
    <div class="rd-palette-catalog__guide"><slot name="guide"></slot></div>
    <div class="rd-palette-catalog__items"><slot name="items"></slot></div>
  </div>
</div>`;

    applyCatalogVariant(this, 'rd-palette-catalog', this.variant);
  }
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

export function registerRdPaletteCatalog(): void {
  defineRosettaElement(RD_PALETTE_CATALOG_TAG, RdPaletteCatalogElement);
}

export function createPaletteCatalogElement(options: {
  groupId: string;
  variant?: CatalogVariant;
  columns?: boolean;
  guide?: HTMLElement;
  title?: HTMLElement;
  specs: HTMLElement[];
}): RdPaletteCatalogElement {
  const el = document.createElement(RD_PALETTE_CATALOG_TAG) as RdPaletteCatalogElement;
  el.setAttribute('group-id', options.groupId);
  if (options.variant) {
    el.setAttribute('variant', options.variant);
  }
  el.setAttribute('columns', options.columns === false ? 'false' : 'true');

  if (options.title) {
    options.title.slot = 'title';
    el.appendChild(options.title);
  }

  if (options.guide) {
    options.guide.slot = 'guide';
    el.appendChild(options.guide);
  }

  for (const spec of options.specs) {
    spec.slot = 'items';
    el.appendChild(spec);
  }

  return el;
}

export { RD_COMPONENT_SPEC_TAG, RD_PALETTE_GROUP_TAG };
