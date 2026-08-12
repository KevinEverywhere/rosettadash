import { defineRosettaElement, readString } from '../../lib/element-utils.js';
import { applyCatalogVariant, readCatalogVariant, type CatalogVariant } from '../_shared/catalog-variant.js';

export const RD_COMPONENT_OPTION_TAG = 'rd-component-option';

/** Inspector property / option row for `rd-component-spec`. */
export interface ComponentOptionProps {
  optionKey: string;
  type: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  variant?: CatalogVariant;
}

export class RdComponentOptionElement extends HTMLElement {
  static readonly tagName = RD_COMPONENT_OPTION_TAG;

  static get observedAttributes(): string[] {
    return ['option-key', 'type', 'label', 'default-value', 'required', 'variant'];
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

  get optionKey(): string {
    return readString(this.getAttribute('option-key'), '');
  }

  get optionType(): string {
    return readString(this.getAttribute('type'), 'string');
  }

  get optionLabel(): string {
    return readString(this.getAttribute('label'), this.optionKey);
  }

  get defaultValue(): string {
    return readString(this.getAttribute('default-value'), '');
  }

  get required(): boolean {
    return this.hasAttribute('required');
  }

  get variant(): CatalogVariant {
    return readCatalogVariant(this.getAttribute('variant'));
  }

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const required = this.required
      ? '<span class="rd-component-option__required">required</span>'
      : '';
    const defaultBlock = this.defaultValue
      ? `<span class="rd-component-option__default">default: <code>${escapeHtml(this.defaultValue)}</code></span>`
      : '';

    root.innerHTML = `
<style>
:host { display: block; }
.rd-component-option {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.5rem;
  font-family: var(--rd-font-family, system-ui, sans-serif);
  font-size: var(--rd-font-size, 0.875rem);
  line-height: var(--rd-line-height, 1.4);
  color: var(--rd-color-text, #1a1a1a);
}
.rd-component-option__label { font-weight: 600; }
.rd-component-option__key {
  font-family: ui-monospace, monospace;
  font-size: 0.75em;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-component-option__type {
  font-size: 0.75em;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-component-option__default code {
  font-family: ui-monospace, monospace;
  font-size: 0.875em;
}
.rd-component-option__required {
  font-size: 0.75em;
  font-weight: 600;
  color: #b45309;
}
.rd-component-option--compact .rd-component-option { font-size: 0.8125rem; }
.rd-component-option--plain .rd-component-option__key { display: none; }
</style>
<div class="rd-component-option" part="option">
  <span class="rd-component-option__label">${escapeHtml(this.optionLabel)}</span>
  <code class="rd-component-option__key">${escapeHtml(this.optionKey)}</code>
  <span class="rd-component-option__type">${escapeHtml(this.optionType)}</span>
  ${required}
  ${defaultBlock}
</div>`;

    applyCatalogVariant(this, 'rd-component-option', this.variant);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function registerRdComponentOption(): void {
  defineRosettaElement(RD_COMPONENT_OPTION_TAG, RdComponentOptionElement);
}
