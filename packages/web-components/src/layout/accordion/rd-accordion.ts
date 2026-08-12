import { defineRosettaElement, readString } from '../../lib/element-utils.js';
import { applyShadowMount, ensureShadowBase, loadShadowPairForTag } from '../../lib/shadow-base.js';

export const RD_ACCORDION_TAG = 'rd-accordion';

/** Public props contract for layout/accordion (all runtimes share this shape). */
export interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  className?: string;
}

export class RdAccordionElement extends HTMLElement {
  static readonly tagName = RD_ACCORDION_TAG;

  private resourcesReady: Promise<void> | null = null;
  private headerListener: (() => void) | null = null;

  static get observedAttributes(): string[] {
    return ['heading', 'title', 'default-open', 'open'];
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    if (!this.hasAttribute('open') && this.defaultOpen) {
      this.setAttribute('open', '');
    }
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

  attributeChangedCallback(): void {
    if (this.shadowRoot && this.resourcesReady) {
      void this.resourcesReady.then(() => this.paint());
    }
  }

  /** Await shadow template + first paint (tests and Storybook helpers). */
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

  private async mountShadow(): Promise<void> {
    const root = this.shadowRoot;
    if (!root || root.querySelector('[data-ref="root"]')) {
      return;
    }
    const pair = await loadShadowPairForTag(
      RD_ACCORDION_TAG,
      './rd-accordion.html',
      './rd-accordion.css',
    );
    applyShadowMount(root, pair);
    const header = root.querySelector('[data-ref="header"]');
    this.headerListener = () => this.toggle();
    header?.addEventListener('click', this.headerListener);
  }

  private toggle(): void {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent('rd-accordion-toggle', {
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

    section?.classList.toggle('rd-accordion--open', open);
    header?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (title) {
      title.textContent = this.heading;
    }
  }
}

export function registerRdAccordion(): void {
  ensureShadowBase(RD_ACCORDION_TAG);
  defineRosettaElement(RD_ACCORDION_TAG, RdAccordionElement);
}
