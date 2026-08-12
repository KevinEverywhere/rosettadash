import { defineRosettaElement, readString } from '../../lib/element-utils.js';
import { escapeHtml, parseLinkItems, type LinkListItem } from '../../lib/parse-link-items.js';
import { applyShadowMount, ensureShadowBase, loadShadowPairForTag } from '../../lib/shadow-base.js';
import { registerRdAccordion, type AccordionProps } from '../accordion/rd-accordion.js';
import { registerRdLinkList, type LinkListProps } from '../../visual/link-list/rd-link-list.js';

export const RD_ACCORDION_LINK_LIST_TAG = 'rd-accordion-link-list';

/** Public props for the accordion + link-list recipe (all runtimes). */
export interface AccordionLinkListProps
  extends AccordionProps, Pick<LinkListProps, 'items' | 'dense'> {}

/**
 * Recipe custom element: collapsible nav / TOC over accordion + link-list atoms.
 * Prefer composing atoms; use this when a single helper is clearer.
 */
export class RdAccordionLinkListElement extends HTMLElement {
  static readonly tagName = RD_ACCORDION_LINK_LIST_TAG;

  private itemsValue: LinkListItem[] = [];
  private resourcesReady: Promise<void> | null = null;
  private headerListener: (() => void) | null = null;

  static get observedAttributes(): string[] {
    return ['heading', 'title', 'default-open', 'open', 'items', 'dense'];
  }

  connectedCallback(): void {
    registerRdAccordion();
    registerRdLinkList();
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    if (!this.hasAttribute('open') && this.defaultOpen) {
      this.setAttribute('open', '');
    }
    this.syncItemsFromAttribute();
    this.resourcesReady = this.mountShadow();
    void this.resourcesReady.then(() => this.paint());
  }

  disconnectedCallback(): void {
    const root = this.shadowRoot;
    const header = root?.querySelector('[data-ref="header"]');
    if (header && this.headerListener) {
      header.removeEventListener('click', this.headerListener);
    }
    this.headerListener = null;
  }

  attributeChangedCallback(name: string): void {
    if (name === 'items') {
      this.syncItemsFromAttribute();
    }
    if (this.shadowRoot && this.resourcesReady) {
      void this.resourcesReady.then(() => this.paint());
    }
  }

  whenReady(): Promise<void> {
    return this.resourcesReady ?? Promise.resolve();
  }

  get heading(): string {
    return readString(
      this.getAttribute('heading') ?? this.getAttribute('title'),
      'Section',
    );
  }

  get defaultOpen(): boolean {
    return this.hasAttribute('default-open');
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  get items(): LinkListItem[] {
    return this.itemsValue;
  }

  set items(value: LinkListItem[]) {
    this.itemsValue = Array.isArray(value) ? value : [];
    this.setAttribute('items', JSON.stringify(this.itemsValue));
  }

  get dense(): boolean {
    return this.hasAttribute('dense');
  }

  private syncItemsFromAttribute(): void {
    this.itemsValue = parseLinkItems(this.getAttribute('items'));
  }

  private async mountShadow(): Promise<void> {
    const root = this.shadowRoot;
    if (!root || root.querySelector('[data-ref="root"]')) {
      return;
    }
    const pair = await loadShadowPairForTag(
      RD_ACCORDION_LINK_LIST_TAG,
      './rd-accordion-link-list.html',
      './rd-accordion-link-list.css',
    );
    applyShadowMount(root, pair);
    const header = root.querySelector('[data-ref="header"]');
    this.headerListener = () => this.toggle();
    header?.addEventListener('click', this.headerListener);
  }

  private toggle(): void {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent('rd-accordion-link-list-toggle', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private paint(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const open = this.open;
    const section = root.querySelector('[data-ref="root"]');
    const header = root.querySelector('[data-ref="header"]');
    const title = root.querySelector('[data-ref="title"]');
    const list = root.querySelector('[data-ref="list"]');

    section?.classList.toggle('rd-accordion--open', open);
    header?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (title) {
      title.textContent = this.heading;
    }
    if (list) {
      list.className = `rd-link-list${this.dense ? ' rd-link-list--dense' : ''}`;
      list.innerHTML = this.itemsValue
        .map(
          (item) =>
            `<li class="rd-link-list__item"><a class="rd-link-list__link" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`,
        )
        .join('');
    }
  }
}

/** Typed recipe helper — same props as the custom element. */
export function AccordionLinkList(
  props: AccordionLinkListProps,
): AccordionLinkListProps {
  return {
    title: props.title,
    defaultOpen: props.defaultOpen ?? false,
    className: props.className,
    items: props.items ?? [],
    dense: props.dense ?? false,
  };
}

export function registerRdAccordionLinkList(): void {
  registerRdAccordion();
  registerRdLinkList();
  ensureShadowBase(RD_ACCORDION_LINK_LIST_TAG);
  defineRosettaElement(RD_ACCORDION_LINK_LIST_TAG, RdAccordionLinkListElement);
}
