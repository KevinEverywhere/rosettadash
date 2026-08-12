import { defineRosettaElement, readString } from '../lib/element-utils.js';
import { applyCatalogVariant, readCatalogVariant, type CatalogVariant } from './catalog-variant.js';

export const RD_PALETTE_GROUP_TAG = 'rd-palette-group';

export type PaletteGroupFit = 'universal' | 'specialized' | 'mixed';

export interface PaletteGroupProps {
  groupId: string;
  label?: string;
  fit?: PaletteGroupFit;
  variant?: CatalogVariant;
}

export class RdPaletteGroupElement extends HTMLElement {
  static readonly tagName = RD_PALETTE_GROUP_TAG;

  static get observedAttributes(): string[] {
    return ['group-id', 'label', 'fit', 'variant'];
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

  get groupLabel(): string {
    return readString(this.getAttribute('label'), this.groupId);
  }

  get fit(): PaletteGroupFit {
    const value = readString(this.getAttribute('fit'), 'mixed');
    if (value === 'universal' || value === 'specialized') {
      return value;
    }
    return 'mixed';
  }

  get variant(): CatalogVariant {
    return readCatalogVariant(this.getAttribute('variant'));
  }

  private fitLabel(): string {
    switch (this.fit) {
      case 'universal':
        return 'Fits most dashboards';
      case 'specialized':
        return 'Specialized / single-purpose flows';
      default:
        return 'Mixed — some universal, some specialized';
    }
  }

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    root.innerHTML = `
<style>
:host { display: block; }
.rd-palette-group {
  display: grid;
  gap: 0.75rem;
  padding: 1rem 1.125rem;
  border: 1px solid var(--rd-color-border, #d0d0d0);
  border-radius: var(--rd-radius-md, 0.5rem);
  background: linear-gradient(180deg, color-mix(in srgb, var(--rd-color-accent, #2563eb) 5%, #fff) 0%, #fff 100%);
  font-family: var(--rd-font-family, system-ui, sans-serif);
  color: var(--rd-color-text, #1a1a1a);
}
.rd-palette-group__title {
  margin: 0;
  font-size: 1.125rem;
}
.rd-palette-group__fit {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-palette-group__fit span {
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: rgb(15 23 42 / 6%);
}
.rd-palette-group__heading {
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-palette-group__body {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
}
.rd-palette-group__related {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--rd-color-muted, #5c5c5c);
}
::slotted([slot="related"] button) {
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--rd-color-border, #d0d0d0);
  border-radius: 999px;
  background: #fff;
  font: inherit;
  font-size: 0.75rem;
  color: var(--rd-color-accent, #2563eb);
  cursor: pointer;
}
.rd-palette-group--compact { padding: 0.75rem; gap: 0.5rem; }
.rd-palette-group--compact .rd-palette-group__title { font-size: 1rem; }
.rd-palette-group--plain {
  background: #fff;
  border-style: dashed;
}
</style>
<aside class="rd-palette-group" part="group" data-guide-group="${escapeAttr(this.groupId)}">
  <h2 class="rd-palette-group__title">${escapeHtml(this.groupLabel)}</h2>
  <p class="rd-palette-group__fit"><span>${escapeHtml(this.fitLabel())}</span></p>
  <slot name="summary"></slot>
  <h3 class="rd-palette-group__heading">How components relate</h3>
  <slot name="relationships"></slot>
  <h3 class="rd-palette-group__heading">Where to learn more</h3>
  <slot name="learn-more"></slot>
  <div class="rd-palette-group__related">
    <span>Related groups:</span>
    <slot name="related"></slot>
  </div>
</aside>`;

    applyCatalogVariant(this, 'rd-palette-group', this.variant);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}

export function registerRdPaletteGroup(): void {
  defineRosettaElement(RD_PALETTE_GROUP_TAG, RdPaletteGroupElement);
}

export function createPaletteGroupElement(options: {
  groupId: string;
  label: string;
  fit: PaletteGroupFit;
  summary: string;
  relationships: string;
  learnMore: string;
  relatedButtonsHtml?: string;
  variant?: CatalogVariant;
  showTitle?: boolean;
}): RdPaletteGroupElement {
  const el = document.createElement(RD_PALETTE_GROUP_TAG) as RdPaletteGroupElement;
  el.setAttribute('group-id', options.groupId);
  el.setAttribute('label', options.label);
  el.setAttribute('fit', options.fit);
  if (options.variant) {
    el.setAttribute('variant', options.variant);
  }

  const summary = document.createElement('p');
  summary.slot = 'summary';
  summary.className = 'rd-palette-group__body';
  summary.textContent = options.summary;
  el.appendChild(summary);

  const relationships = document.createElement('p');
  relationships.slot = 'relationships';
  relationships.className = 'rd-palette-group__body';
  relationships.textContent = options.relationships;
  el.appendChild(relationships);

  const learnMore = document.createElement('p');
  learnMore.slot = 'learn-more';
  learnMore.className = 'rd-palette-group__body';
  learnMore.innerHTML = options.learnMore.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  el.appendChild(learnMore);

  if (options.relatedButtonsHtml) {
    const related = document.createElement('div');
    related.slot = 'related';
    related.innerHTML = options.relatedButtonsHtml;
    el.appendChild(related);
  }

  return el;
}
