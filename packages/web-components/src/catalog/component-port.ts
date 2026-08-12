import { defineRosettaElement, readString } from '../lib/element-utils.js';
import { applyCatalogVariant, readCatalogVariant, type CatalogVariant } from './catalog-variant.js';

export const RD_COMPONENT_PORT_TAG = 'rd-component-port';

export type ComponentPortDirection = 'input' | 'output';

/** Declarative input/output port for `rd-component-spec` (XML-friendly attributes). */
export interface ComponentPortProps {
  direction: ComponentPortDirection;
  name: string;
  dataType: string;
  required?: boolean;
  description?: string;
  variant?: CatalogVariant;
}

export class RdComponentPortElement extends HTMLElement {
  static readonly tagName = RD_COMPONENT_PORT_TAG;

  static get observedAttributes(): string[] {
    return ['direction', 'name', 'data-type', 'required', 'description', 'variant'];
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

  get direction(): ComponentPortDirection {
    const value = readString(this.getAttribute('direction'), 'input');
    return value === 'output' ? 'output' : 'input';
  }

  get portName(): string {
    return readString(this.getAttribute('name'), '');
  }

  get dataType(): string {
    return readString(this.getAttribute('data-type'), 'any');
  }

  get required(): boolean {
    return this.hasAttribute('required');
  }

  get description(): string {
    return readString(this.getAttribute('description'), '');
  }

  get variant(): CatalogVariant {
    return readCatalogVariant(this.getAttribute('variant'));
  }

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const variant = this.variant;
    const required = this.required
      ? '<span class="rd-component-port__required">required</span>'
      : '';
    const desc = this.description
      ? `<span class="rd-component-port__description">${escapeHtml(this.description)}</span>`
      : '';

    root.innerHTML = `
<style>
:host { display: block; }
.rd-component-port {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.375rem;
  font-family: var(--rd-font-family, system-ui, sans-serif);
  font-size: var(--rd-font-size, 0.875rem);
  line-height: var(--rd-line-height, 1.4);
  color: var(--rd-color-text, #1a1a1a);
}
.rd-component-port__name {
  font-family: ui-monospace, monospace;
  font-size: 0.8125em;
  font-weight: 600;
}
.rd-component-port__type {
  padding: 0.0625rem 0.375rem;
  border-radius: 999px;
  background: rgb(15 23 42 / 6%);
  font-size: 0.75em;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-component-port__required {
  font-size: 0.75em;
  font-weight: 600;
  color: #b45309;
}
.rd-component-port__description {
  flex: 1 1 100%;
  font-size: 0.8125em;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-component-port--compact .rd-component-port { font-size: 0.8125rem; }
.rd-component-port--plain .rd-component-port__type { background: transparent; padding: 0; }
</style>
<div class="rd-component-port" part="port">
  <span class="rd-component-port__direction">${this.direction}</span>
  <code class="rd-component-port__name">${escapeHtml(this.portName)}</code>
  <span class="rd-component-port__type">${escapeHtml(this.dataType)}</span>
  ${required}
  ${desc}
</div>`;

    applyCatalogVariant(this, 'rd-component-port', variant);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function registerRdComponentPort(): void {
  defineRosettaElement(RD_COMPONENT_PORT_TAG, RdComponentPortElement);
}
