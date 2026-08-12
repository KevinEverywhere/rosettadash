import type { ComponentDefinition } from '@rosettadash/core';
import { defineRosettaElement, readString } from '../../lib/element-utils.js';
import { RD_COMPONENT_OPTION_TAG } from '../component-option/rd-component-option.js';
import { RD_COMPONENT_PORT_TAG } from '../component-port/rd-component-port.js';
import { RD_COMPONENT_REQUIREMENT_TAG } from '../component-requirement/rd-component-requirement.js';
import { applyCatalogVariant, readCatalogVariant, type CatalogVariant } from '../_shared/catalog-variant.js';

export const RD_COMPONENT_SPEC_TAG = 'rd-component-spec';

export interface ComponentSpecProps {
  componentType: string;
  label: string;
  description?: string;
  category?: string;
  isVisual?: boolean;
  variant?: CatalogVariant;
  /** When set, header acts as navigation affordance (Storybook catalog). */
  navGroupId?: string;
}

export class RdComponentSpecElement extends HTMLElement {
  static readonly tagName = RD_COMPONENT_SPEC_TAG;

  static get observedAttributes(): string[] {
    return [
      'component-type',
      'label',
      'description',
      'category',
      'is-visual',
      'variant',
      'nav-group-id',
    ];
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    if (this.navGroupId) {
      this.setAttribute('data-nav-group', this.navGroupId);
    }
    this.render();
  }

  attributeChangedCallback(): void {
    if (this.shadowRoot) {
      this.render();
    }
  }

  get componentType(): string {
    return readString(this.getAttribute('component-type'), '');
  }

  get specLabel(): string {
    return readString(this.getAttribute('label'), 'Component');
  }

  get description(): string {
    return readString(this.getAttribute('description'), '');
  }

  get category(): string {
    return readString(this.getAttribute('category'), '');
  }

  get isVisual(): boolean {
    return this.getAttribute('is-visual') !== 'false';
  }

  get variant(): CatalogVariant {
    return readCatalogVariant(this.getAttribute('variant'));
  }

  get navGroupId(): string {
    return readString(this.getAttribute('nav-group-id'), '');
  }

  private portRows(selector: string, direction: 'input' | 'output'): string {
    const ports = [...this.querySelectorAll(selector)].filter(
      (el) => (el.getAttribute('direction') ?? 'input') === direction,
    );
    if (ports.length === 0) {
      return '';
    }
    const rows = ports
      .map((el) => {
        const name = escapeHtml(el.getAttribute('name') ?? '');
        const dataType = escapeHtml(el.getAttribute('data-type') ?? 'any');
        const required = el.hasAttribute('required')
          ? '<span class="rd-component-spec__required">required</span>'
          : '';
        const desc = el.getAttribute('description')
          ? `<span class="rd-component-spec__port-desc">${escapeHtml(el.getAttribute('description') ?? '')}</span>`
          : '';
        return `<li><code>${name}</code> <span class="rd-component-spec__port-type">${dataType}</span>${required}${desc}</li>`;
      })
      .join('');
    const label = direction === 'input' ? 'Inputs' : 'Outputs';
    return `<div class="rd-component-spec__section"><span class="rd-component-spec__section-label">${label}</span><ul class="rd-component-spec__port-list">${rows}</ul></div>`;
  }

  private requirementRows(): string {
    const items = [...this.querySelectorAll(RD_COMPONENT_REQUIREMENT_TAG)];
    if (items.length === 0) {
      return '';
    }
    const rows = items
      .map((el) => {
        const kind = el.getAttribute('kind') === 'assumption' ? 'Assumption' : 'Dependency';
        const text = escapeHtml(el.textContent?.trim() ?? '');
        return `<li><span class="rd-component-spec__req-kind">${kind}</span> ${text}</li>`;
      })
      .join('');
    return `<div class="rd-component-spec__section"><span class="rd-component-spec__section-label">Requirements</span><ul class="rd-component-spec__req-list">${rows}</ul></div>`;
  }

  private optionRows(): string {
    const items = [...this.querySelectorAll(RD_COMPONENT_OPTION_TAG)];
    if (items.length === 0) {
      return '';
    }
    const rows = items
      .map((el) => {
        const label = escapeHtml(el.getAttribute('label') ?? el.getAttribute('option-key') ?? '');
        const key = escapeHtml(el.getAttribute('option-key') ?? '');
        const type = escapeHtml(el.getAttribute('type') ?? 'string');
        const required = el.hasAttribute('required')
          ? '<span class="rd-component-spec__required">required</span>'
          : '';
        const def = el.getAttribute('default-value')
          ? `<span class="rd-component-spec__opt-default">default: <code>${escapeHtml(el.getAttribute('default-value') ?? '')}</code></span>`
          : '';
        return `<li><strong>${label}</strong> <code>${key}</code> <span class="rd-component-spec__port-type">${type}</span>${required}${def}</li>`;
      })
      .join('');
    return `<div class="rd-component-spec__section"><span class="rd-component-spec__section-label">Options</span><ul class="rd-component-spec__opt-list">${rows}</ul></div>`;
  }

  private hideMetaChildren(): void {
    this.querySelectorAll(
      `${RD_COMPONENT_PORT_TAG}, ${RD_COMPONENT_REQUIREMENT_TAG}, ${RD_COMPONENT_OPTION_TAG}`,
    ).forEach((el) => {
      (el as HTMLElement).hidden = true;
    });
  }

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    this.hideMetaChildren();

    const variant = this.variant;
    const navAttr = this.navGroupId ? ` data-nav-group="${escapeAttr(this.navGroupId)}"` : '';
    const linkable = this.navGroupId ? ' rd-component-spec__header--linkable' : '';
    const meta = this.category
      ? `<footer class="rd-component-spec__footer"><code>${escapeHtml(this.componentType)}</code><span>${escapeHtml(this.category)}${this.isVisual ? '' : ' · non-visual'}</span></footer>`
      : `<footer class="rd-component-spec__footer"><code>${escapeHtml(this.componentType)}</code></footer>`;

    const learnMore = this.querySelector('[slot="learn-more"]');
    const learnMoreHtml = learnMore
      ? `<div class="rd-component-spec__learn"><slot name="learn-more"></slot></div>`
      : '';

    root.innerHTML = `
<style>
:host { display: block; }
.rd-component-spec {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--rd-color-border, #d0d0d0);
  border-radius: var(--rd-radius-md, 0.5rem);
  background: #fff;
  font-family: var(--rd-font-family, system-ui, sans-serif);
  color: var(--rd-color-text, #1a1a1a);
}
.rd-component-spec__header h3 {
  margin: 0;
  font-size: 1rem;
}
.rd-component-spec__header p {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: var(--rd-color-muted, #5c5c5c);
  line-height: 1.45;
}
.rd-component-spec__header--linkable { cursor: pointer; }
.rd-component-spec__header--linkable h3 { color: var(--rd-color-accent, #2563eb); }
.rd-component-spec__meta {
  display: grid;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--rd-color-border, #d0d0d0);
  border-radius: var(--rd-radius-sm, 0.25rem);
  background: var(--rd-color-surface, #f8fafc);
  font-size: 0.8125rem;
}
.rd-component-spec__section { display: grid; gap: 0.375rem; }
.rd-component-spec__section-label {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-component-spec__port-list,
.rd-component-spec__req-list,
.rd-component-spec__opt-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.25rem;
}
.rd-component-spec__port-list li,
.rd-component-spec__req-list li,
.rd-component-spec__opt-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.375rem;
  font-size: 0.8125rem;
}
.rd-component-spec__port-type {
  padding: 0.0625rem 0.375rem;
  border-radius: 999px;
  background: rgb(15 23 42 / 6%);
  font-size: 0.6875rem;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-component-spec__required {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #b45309;
}
.rd-component-spec__req-kind {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-component-spec__port-desc,
.rd-component-spec__opt-default {
  flex: 1 1 100%;
  font-size: 0.75rem;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-component-spec__demo ::slotted(*) { display: block; }
.rd-component-spec__learn {
  font-size: 0.75rem;
  color: var(--rd-color-muted, #5c5c5c);
  line-height: 1.45;
}
.rd-component-spec__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--rd-color-border, #d0d0d0);
  font-size: 0.6875rem;
  color: var(--rd-color-muted, #5c5c5c);
}
.rd-component-spec__footer code {
  font-family: ui-monospace, monospace;
}
.rd-component-spec--compact {
  padding: 0.625rem 0.75rem;
  gap: 0.5rem;
}
.rd-component-spec--compact .rd-component-spec__header h3 { font-size: 0.9375rem; }
.rd-component-spec--plain {
  border-style: dashed;
  background: transparent;
}
.rd-component-spec--plain .rd-component-spec__meta {
  background: transparent;
  border-style: dashed;
}
</style>
<article class="rd-component-spec"${navAttr} part="spec">
  <header class="rd-component-spec__header${linkable}">
    <h3>${escapeHtml(this.specLabel)}</h3>
    <p>${escapeHtml(this.description)}</p>
    <slot name="jump"></slot>
  </header>
  <div class="rd-component-spec__meta">
    ${this.portRows(RD_COMPONENT_PORT_TAG, 'input')}
    ${this.portRows(RD_COMPONENT_PORT_TAG, 'output')}
    ${this.requirementRows()}
    ${this.optionRows()}
  </div>
  <div class="rd-component-spec__demo"><slot name="demo"></slot></div>
  ${learnMoreHtml}
  ${meta}
</article>`;

    applyCatalogVariant(this, 'rd-component-spec', variant);
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

export function registerRdComponentSpec(): void {
  defineRosettaElement(RD_COMPONENT_SPEC_TAG, RdComponentSpecElement);
}

/** Factory helper — build spec element tree from registry definition. */
export function createComponentSpecElement(
  definition: ComponentDefinition,
  options: {
    variant?: CatalogVariant;
    dependencies?: string[];
    assumptions?: string[];
    learnMoreHtml?: string;
    navGroupId?: string;
  } = {},
): RdComponentSpecElement {
  const el = document.createElement(RD_COMPONENT_SPEC_TAG) as RdComponentSpecElement;
  el.setAttribute('component-type', definition.type);
  el.setAttribute('label', definition.label);
  if (definition.description) {
    el.setAttribute('description', definition.description);
  }
  el.setAttribute('category', definition.category);
  el.setAttribute('is-visual', definition.isVisual ? 'true' : 'false');
  if (options.variant) {
    el.setAttribute('variant', options.variant);
  }
  if (options.navGroupId) {
    el.setAttribute('nav-group-id', options.navGroupId);
  }

  for (const port of definition.inputs) {
    const portEl = document.createElement(RD_COMPONENT_PORT_TAG);
    portEl.setAttribute('direction', 'input');
    portEl.setAttribute('name', port.name);
    portEl.setAttribute('data-type', port.dataType);
    if (port.required) {
      portEl.setAttribute('required', '');
    }
    if (port.description) {
      portEl.setAttribute('description', port.description);
    }
    if (options.variant) {
      portEl.setAttribute('variant', options.variant);
    }
    el.appendChild(portEl);
  }

  for (const port of definition.outputs) {
    const portEl = document.createElement(RD_COMPONENT_PORT_TAG);
    portEl.setAttribute('direction', 'output');
    portEl.setAttribute('name', port.name);
    portEl.setAttribute('data-type', port.dataType);
    if (port.description) {
      portEl.setAttribute('description', port.description);
    }
    if (options.variant) {
      portEl.setAttribute('variant', options.variant);
    }
    el.appendChild(portEl);
  }

  for (const text of options.dependencies ?? []) {
    const req = document.createElement(RD_COMPONENT_REQUIREMENT_TAG);
    req.setAttribute('kind', 'dependency');
    if (options.variant) {
      req.setAttribute('variant', options.variant);
    }
    req.textContent = text;
    el.appendChild(req);
  }

  for (const text of options.assumptions ?? []) {
    const req = document.createElement(RD_COMPONENT_REQUIREMENT_TAG);
    req.setAttribute('kind', 'assumption');
    if (options.variant) {
      req.setAttribute('variant', options.variant);
    }
    req.textContent = text;
    el.appendChild(req);
  }

  for (const property of definition.properties) {
    const opt = document.createElement(RD_COMPONENT_OPTION_TAG);
    opt.setAttribute('option-key', property.key);
    opt.setAttribute('type', property.type);
    opt.setAttribute('label', property.label);
    if (property.default !== undefined) {
      opt.setAttribute('default-value', String(property.default));
    }
    if (property.required) {
      opt.setAttribute('required', '');
    }
    if (options.variant) {
      opt.setAttribute('variant', options.variant);
    }
    el.appendChild(opt);
  }

  if (options.learnMoreHtml) {
    const learn = document.createElement('div');
    learn.slot = 'learn-more';
    learn.innerHTML = options.learnMoreHtml;
    el.appendChild(learn);
  }

  return el;
}
