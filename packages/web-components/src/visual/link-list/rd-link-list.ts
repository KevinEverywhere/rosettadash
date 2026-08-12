import { defineRosettaElement } from '../../lib/element-utils.js';
import { escapeHtml, parseLinkItems, type LinkListItem } from '../../lib/parse-link-items.js';
import { applyShadowMount, ensureShadowBase, loadShadowPairForTag } from '../../lib/shadow-base.js';

export const RD_LINK_LIST_TAG = 'rd-link-list';

export type { LinkListItem };

/** Public props contract for visual/link-list (all runtimes share this shape). */
export interface LinkListProps {
  items?: LinkListItem[];
  className?: string;
  /** When true, render a denser list. */
  dense?: boolean;
}

export class RdLinkListElement extends HTMLElement {
  static readonly tagName = RD_LINK_LIST_TAG;

  private itemsValue: LinkListItem[] = [];
  private resourcesReady: Promise<void> | null = null;

  static get observedAttributes(): string[] {
    return ['items', 'dense'];
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.syncItemsFromAttribute();
    this.resourcesReady = this.mountShadow();
    void this.resourcesReady.then(() => this.paint());
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
    if (!root || root.querySelector('[data-ref="list"]')) {
      return;
    }
    const pair = await loadShadowPairForTag(
      RD_LINK_LIST_TAG,
      './rd-link-list.html',
      './rd-link-list.css',
    );
    applyShadowMount(root, pair);
  }

  private paint(): void {
    const root = this.shadowRoot;
    const list = root?.querySelector('[data-ref="list"]');
    if (!list) {
      return;
    }

    list.className = `rd-link-list${this.dense ? ' rd-link-list--dense' : ''}`;
    list.innerHTML = this.itemsValue
      .map(
        (item) =>
          `<li class="rd-link-list__item"><a class="rd-link-list__link" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`,
      )
      .join('');
  }
}

export function registerRdLinkList(): void {
  ensureShadowBase(RD_LINK_LIST_TAG);
  defineRosettaElement(RD_LINK_LIST_TAG, RdLinkListElement);
}
