import { defineRosettaElement, readString } from '../lib/element-utils.js';
import { applyCatalogVariant, readCatalogVariant, type CatalogVariant } from './catalog-variant.js';

export const RD_COMPONENT_REQUIREMENT_TAG = 'rd-component-requirement';

export type ComponentRequirementKind = 'dependency' | 'assumption';

export interface ComponentRequirementProps {
  kind: ComponentRequirementKind;
  variant?: CatalogVariant;
}

export class RdComponentRequirementElement extends HTMLElement {
  static readonly tagName = RD_COMPONENT_REQUIREMENT_TAG;

  static get observedAttributes(): string[] {
    return ['kind', 'variant'];
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

  get kind(): ComponentRequirementKind {
    return readString(this.getAttribute('kind'), 'dependency') === 'assumption'
      ? 'assumption'
      : 'dependency';
  }

  get variant(): CatalogVariant {
    return readCatalogVariant(this.getAttribute('variant'));
  }

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const text = this.textContent?.trim() ?? '';
    const kindLabel = this.kind === 'assumption' ? 'Assumption' : 'Dependency';

    root.innerHTML = `
<style>
:host { display: block; }
.rd-component-requirement {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.375rem 0.5rem;
  align-items: baseline;
  font-family: var(--rd-font-family, system-ui, sans-serif);
  font-size: var(--rd-font-size, 0.875rem);
  line-height: var(--rd-line-height, 1.45);
  color: var(--rd-color-text, #1a1a1a);
}
.rd-component-requirement__kind {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-component-requirement__text { margin: 0; }
.rd-component-requirement--compact .rd-component-requirement { font-size: 0.8125rem; }
.rd-component-requirement--plain .rd-component-requirement__kind { display: none; }
</style>
<div class="rd-component-requirement" part="requirement">
  <span class="rd-component-requirement__kind">${kindLabel}</span>
  <p class="rd-component-requirement__text">${escapeHtml(text)}</p>
</div>`;

    applyCatalogVariant(this, 'rd-component-requirement', this.variant);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function registerRdComponentRequirement(): void {
  defineRosettaElement(RD_COMPONENT_REQUIREMENT_TAG, RdComponentRequirementElement);
}
