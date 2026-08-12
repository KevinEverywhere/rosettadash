import { defineRosettaElement, readString } from '../../lib/element-utils';

export const RD_ACCORDION_TAG = 'rd-accordion';

/** Public props contract for layout/accordion (all runtimes share this shape). */
export interface AccordionProps {
  /** Header label shown on the accordion control. */
  title: string;
  defaultOpen?: boolean;
  className?: string;
}

export class RdAccordionElement extends HTMLElement {
  static readonly tagName = RD_ACCORDION_TAG;

  private panelEl: HTMLElement | null = null;

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
    this.render();
  }

  attributeChangedCallback(): void {
    if (this.shadowRoot) {
      this.render();
    }
  }

  /** Accordion header label (`heading` preferred; `title` accepted as alias). */
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

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const open = this.open;
    root.innerHTML = `
      <style>
        :host { display: block; }
        .rd-accordion {
          border: 1px solid var(--rd-color-border, #d0d0d0);
          border-radius: var(--rd-radius-md, 0.5rem);
          background: var(--rd-color-surface, transparent);
          color: var(--rd-color-text, #1a1a1a);
          font-size: var(--rd-font-size, 0.875rem);
          line-height: var(--rd-line-height, 1.4);
        }
        .rd-accordion__header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: var(--rd-space-sm, 0.5rem) var(--rd-space-md, 1rem);
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }
        .rd-accordion__header:focus-visible {
          outline: 2px solid var(--rd-color-accent, #2563eb);
          outline-offset: -2px;
        }
        .rd-accordion__chevron {
          transition: transform 0.15s ease;
        }
        .rd-accordion--open .rd-accordion__chevron {
          transform: rotate(90deg);
        }
        .rd-accordion__panel {
          display: none;
          padding: 0 var(--rd-space-md, 1rem) var(--rd-space-md, 1rem);
        }
        .rd-accordion--open .rd-accordion__panel {
          display: block;
        }
      </style>
      <section class="rd-accordion${open ? ' rd-accordion--open' : ''}" data-testid="rd-accordion">
        <button
          type="button"
          class="rd-accordion__header"
          aria-expanded="${open ? 'true' : 'false'}"
          aria-controls="rd-accordion-panel"
        >
          <span class="rd-accordion__title">${this.heading}</span>
          <span class="rd-accordion__chevron" aria-hidden="true">›</span>
        </button>
        <div class="rd-accordion__panel" id="rd-accordion-panel" role="region">
          <slot></slot>
        </div>
      </section>
    `;

    this.panelEl = root.querySelector('.rd-accordion');
    root.querySelector('button')?.addEventListener('click', () => this.toggle());
  }
}

export function registerRdAccordion(): void {
  defineRosettaElement(RD_ACCORDION_TAG, RdAccordionElement);
}
