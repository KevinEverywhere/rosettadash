import type { ComponentDefinition } from '@rosettadash/core';
import { defineRosettaElement, readString } from '../../lib/element-utils.js';
import { applyShadowMount, ensureShadowBase, getShadowBase, loadShadowPairForTag } from '../../lib/shadow-base.js';
import { loadTextResource } from '../../lib/shadow-resources.js';
import { RD_ATTRIBUTE_TAG, type RdAttributeElement } from '../component-attribute/rd-attribute.js';
import { escapeHtml, applyMarkupVariant, taxonomyToRdTag } from '../_shared/markup-shared.js';
import { RD_SUBCOMPONENT_NAME_TAG, type RdSubcomponentNameElement } from '../subcomponent-name/rd-subcomponent-name.js';

export const RD_COMPONENT_NAME_TAG = 'rd-component-name';

export class RdComponentNameElement extends HTMLElement {
  static readonly tagName = RD_COMPONENT_NAME_TAG;

  private resourcesReady: Promise<void> | null = null;

  static get observedAttributes(): string[] {
    return ['tag', 'label', 'description', 'component-type', 'variant', 'nav-group-id'];
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    const nav = readString(this.getAttribute('nav-group-id'), '');
    if (nav) {
      this.setAttribute('data-nav-group', nav);
    }
    this.resourcesReady = this.mountShadow();
    void this.resourcesReady.then(() => this.paint());
  }

  attributeChangedCallback(): void {
    if (this.shadowRoot && this.resourcesReady) {
      void this.resourcesReady.then(() => this.paint());
    }
  }

  whenReady(): Promise<void> {
    return this.resourcesReady ?? Promise.resolve();
  }

  get displayTag(): string {
    const explicit = readString(this.getAttribute('tag'), '');
    if (explicit) {
      return explicit.startsWith('rd-') ? explicit : `rd-${explicit}`;
    }
    const type = readString(this.getAttribute('component-type'), '');
    return type ? taxonomyToRdTag(type) : 'rd-component';
  }

  get label(): string {
    return readString(this.getAttribute('label'), '');
  }

  get description(): string {
    return readString(this.getAttribute('description'), '');
  }

  private renderAttributeLine(attr: RdAttributeElement, indent: string): string {
    const reqClass = attr.requirementClass;
    const flag = reqClass;
    const prefix = attr.isOutput ? '' : 'rd-';
    const name = escapeHtml(attr.attrName);
    const value = attr.attrValue ? escapeHtml(attr.attrValue) : '';
    const valuePart = value
      ? `<span class="rd-markup-tree__punct">=</span><span class="rd-markup-tree__punct">"</span><span class="rd-markup-tree__attr--${reqClass}">${value}</span><span class="rd-markup-tree__punct">"</span>`
      : '';
    return `${indent}<span class="rd-markup-tree__attr--${reqClass}">${prefix}${name}</span>${valuePart} <span class="rd-markup-tree__flag rd-markup-tree__flag--${reqClass}">${flag}</span>`;
  }

  private renderSubcomponent(sub: RdSubcomponentNameElement, indent: string): string {
    const reqClass = sub.requirementClass;
    const flag = reqClass;
    const tag = escapeHtml(sub.subTag);
    const attrs = sub.attributeElements;
    const childSubs = [...sub.querySelectorAll(`:scope > ${RD_SUBCOMPONENT_NAME_TAG}`)] as RdSubcomponentNameElement[];

    if (attrs.length === 0 && childSubs.length === 0) {
      const bind = sub.bindHint
        ? ` <span class="rd-markup-tree__attr--${reqClass}">rd-bind="${escapeHtml(sub.bindHint)}"</span>`
        : '';
      return `${indent}<span class="rd-markup-tree__punct">&lt;</span><span class="rd-markup-tree__tag">${tag}</span>${bind} <span class="rd-markup-tree__flag rd-markup-tree__flag--${reqClass}">${flag}</span><span class="rd-markup-tree__punct"> /&gt;</span>`;
    }

    const innerIndent = `${indent}      `;
    const attrLines = attrs.map((a) => this.renderAttributeLine(a, innerIndent)).join('\n');
    const childLines = childSubs.map((c) => this.renderSubcomponent(c, `${indent}  `)).join('\n');

    return `${indent}<span class="rd-markup-tree__punct">&lt;</span><span class="rd-markup-tree__tag">${tag}</span> <span class="rd-markup-tree__flag rd-markup-tree__flag--${reqClass}">${flag}</span><span class="rd-markup-tree__punct">&gt;</span>\n${attrLines}${childLines ? `\n${childLines}` : ''}\n${indent}<span class="rd-markup-tree__punct">&lt;/</span><span class="rd-markup-tree__tag">${tag}</span><span class="rd-markup-tree__punct">&gt;</span>`;
  }

  private renderMarkupTree(): string {
    const tag = escapeHtml(this.displayTag);
    const rootAttrs = [...this.querySelectorAll(`:scope > ${RD_ATTRIBUTE_TAG}`)] as RdAttributeElement[];
    const rootSubs = [...this.querySelectorAll(`:scope > ${RD_SUBCOMPONENT_NAME_TAG}`)] as RdSubcomponentNameElement[];

    if (rootAttrs.length === 0 && rootSubs.length === 0) {
      return `<span class="rd-markup-tree__punct">&lt;</span><span class="rd-markup-tree__tag">${tag}</span><span class="rd-markup-tree__punct"> /&gt;</span>`;
    }

    const openIndent = '      ';
    const attrLines = rootAttrs.map((a) => this.renderAttributeLine(a, openIndent)).join('\n');
    const subLines = rootSubs.map((s) => this.renderSubcomponent(s, '  ')).join('\n');

    return `<span class="rd-markup-tree__punct">&lt;</span><span class="rd-markup-tree__tag">${tag}</span>\n${attrLines}\n<span class="rd-markup-tree__punct">&gt;</span>\n${subLines}\n<span class="rd-markup-tree__punct">&lt;/</span><span class="rd-markup-tree__tag">${tag}</span><span class="rd-markup-tree__punct">&gt;</span>`;
  }

  private hideMarkupChildren(): void {
    this.querySelectorAll(`${RD_ATTRIBUTE_TAG}, ${RD_SUBCOMPONENT_NAME_TAG}`).forEach((el) => {
      (el as HTMLElement).hidden = true;
    });
  }

  private async mountShadow(): Promise<void> {
    const root = this.shadowRoot;
    if (!root || root.querySelector('[data-ref="root"]')) {
      return;
    }
    const pair = await loadShadowPairForTag(
      RD_COMPONENT_NAME_TAG,
      './rd-component-name.html',
      './rd-component-name.css',
    );
    const markupCss = await loadTextResource('../_shared/markup-tree.css', getShadowBase(RD_COMPONENT_NAME_TAG));
    applyShadowMount(root, { html: pair.html, css: `${pair.css}\n${markupCss}` });
  }

  private paint(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    this.hideMarkupChildren();

    const headerEl = root.querySelector('[data-ref="header"]');
    if (headerEl) {
      headerEl.innerHTML = this.label
        ? `<header class="rd-component-name__header"><h3>${escapeHtml(this.label)}</h3>${this.description ? `<p>${escapeHtml(this.description)}</p>` : ''}</header>`
        : '';
    }

    const tree = root.querySelector('[data-ref="tree"]');
    if (tree) {
      tree.innerHTML = this.renderMarkupTree();
    }

    applyMarkupVariant(this, 'rd-component-name');
  }
}

export function registerRdComponentName(): void {
  ensureShadowBase(RD_COMPONENT_NAME_TAG);
  defineRosettaElement(RD_COMPONENT_NAME_TAG, RdComponentNameElement);
}

export interface BuildComponentMarkupOptions {
  dependencies?: string[];
  assumptions?: string[];
  /** Map dependency text to subcomponent tag hints */
  subcomponents?: Array<{
    tag: string;
    bind?: string;
    required?: boolean;
    attributes?: Array<{ name: string; value?: string; required?: boolean }>;
  }>;
}

/** Build declarative markup tree from registry definition — no HTML strings. */
export function createComponentNameElement(
  definition: ComponentDefinition,
  options: BuildComponentMarkupOptions & {
    variant?: string;
    navGroupId?: string;
  } = {},
): RdComponentNameElement {
  const el = document.createElement(RD_COMPONENT_NAME_TAG) as RdComponentNameElement;
  el.setAttribute('component-type', definition.type);
  el.setAttribute('label', definition.label);
  if (definition.description) {
    el.setAttribute('description', definition.description);
  }
  if (options.variant) {
    el.setAttribute('variant', options.variant);
  }
  if (options.navGroupId) {
    el.setAttribute('nav-group-id', options.navGroupId);
  }

  for (const port of definition.inputs) {
    const attr = document.createElement(RD_ATTRIBUTE_TAG);
    attr.setAttribute('name', port.name);
    attr.setAttribute('value', port.dataType);
    if (port.required) {
      attr.setAttribute('required', '');
    } else {
      attr.setAttribute('optional', '');
    }
    el.appendChild(attr);
  }

  for (const port of definition.outputs) {
    const attr = document.createElement(RD_ATTRIBUTE_TAG);
    attr.setAttribute('name', port.name);
    attr.setAttribute('value', port.dataType);
    attr.setAttribute('output', '');
    attr.setAttribute('optional', '');
    el.appendChild(attr);
  }

  for (const property of definition.properties) {
    const attr = document.createElement(RD_ATTRIBUTE_TAG);
    attr.setAttribute('name', property.key);
    if (property.default !== undefined) {
      attr.setAttribute('value', String(property.default));
    } else if (property.type) {
      attr.setAttribute('value', property.type);
    }
    if (property.required) {
      attr.setAttribute('required', '');
    } else {
      attr.setAttribute('optional', '');
    }
    el.appendChild(attr);
  }

  for (const sub of options.subcomponents ?? []) {
    const subEl = document.createElement(RD_SUBCOMPONENT_NAME_TAG);
    subEl.setAttribute('tag', sub.tag);
    if (sub.bind) {
      subEl.setAttribute('bind', sub.bind);
    }
    if (sub.required) {
      subEl.setAttribute('required', '');
    } else {
      subEl.setAttribute('optional', '');
    }
    for (const a of sub.attributes ?? []) {
      const attr = document.createElement(RD_ATTRIBUTE_TAG);
      attr.setAttribute('name', a.name);
      if (a.value) {
        attr.setAttribute('value', a.value);
      }
      if (a.required) {
        attr.setAttribute('required', '');
      } else {
        attr.setAttribute('optional', '');
      }
      subEl.appendChild(attr);
    }
    el.appendChild(subEl);
  }

  for (const dep of options.dependencies ?? []) {
    const attr = document.createElement(RD_ATTRIBUTE_TAG);
    attr.setAttribute('name', 'depends-on');
    attr.setAttribute('value', dep);
    attr.setAttribute('optional', '');
    el.appendChild(attr);
  }

  for (const assumption of options.assumptions ?? []) {
    const attr = document.createElement(RD_ATTRIBUTE_TAG);
    attr.setAttribute('name', 'assume');
    attr.setAttribute('value', assumption);
    attr.setAttribute('optional', '');
    el.appendChild(attr);
  }

  return el;
}
