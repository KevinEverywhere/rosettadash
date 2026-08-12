import { defineRosettaElement, readString } from '../../lib/element-utils';
import {
  registerRdAccordion,
  type AccordionProps,
} from '../accordion/accordion';
import {
  registerRdLinkList,
  type LinkListItem,
  type LinkListProps,
} from '../../visual/link-list/link-list';

export const RD_ACCORDION_LINK_LIST_TAG = 'rd-accordion-link-list';

/** Public props for the accordion + link-list recipe (all runtimes). */
export interface AccordionLinkListProps
  extends AccordionProps, Pick<LinkListProps, 'items' | 'dense'> {}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseItems(raw: string | null): LinkListItem[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }
        const record = entry as Record<string, unknown>;
        const label = readString(record['label'], '');
        const href = readString(record['href'], '');
        if (!label || !href) {
          return null;
        }
        return { label, href };
      })
      .filter((item): item is LinkListItem => item !== null);
  } catch {
    return [];
  }
}

/**
 * Recipe custom element: collapsible nav / TOC over accordion + link-list atoms.
 * Prefer composing atoms; use this when a single helper is clearer.
 */
export class RdAccordionLinkListElement extends HTMLElement {
  static readonly tagName = RD_ACCORDION_LINK_LIST_TAG;

  private itemsValue: LinkListItem[] = [];

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
    this.render();
  }

  attributeChangedCallback(name: string): void {
    if (name === 'items') {
      this.syncItemsFromAttribute();
    }
    if (this.shadowRoot) {
      this.render();
    }
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
    this.itemsValue = parseItems(this.getAttribute('items'));
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

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const open = this.open;
    const denseClass = this.dense ? ' rd-link-list--dense' : '';
    const links = this.itemsValue
      .map(
        (item) =>
          `<li class="rd-link-list__item"><a class="rd-link-list__link" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`,
      )
      .join('');

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
          font-family: var(--rd-font-family, system-ui, sans-serif);
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
        .rd-accordion__chevron { transition: transform 0.15s ease; }
        .rd-accordion--open .rd-accordion__chevron { transform: rotate(90deg); }
        .rd-accordion__panel {
          display: none;
          padding: 0 var(--rd-space-md, 1rem) var(--rd-space-md, 1rem);
        }
        .rd-accordion--open .rd-accordion__panel { display: block; }
        .rd-link-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .rd-link-list__item + .rd-link-list__item {
          margin-top: var(--rd-space-xs, 0.25rem);
        }
        .rd-link-list--dense .rd-link-list__item + .rd-link-list__item { margin-top: 0; }
        .rd-link-list__link {
          color: var(--rd-color-accent, #2563eb);
          text-decoration: none;
        }
        .rd-link-list__link:hover,
        .rd-link-list__link:focus-visible { text-decoration: underline; }
      </style>
      <section
        class="rd-accordion rd-accordion-link-list${open ? ' rd-accordion--open' : ''}"
        data-testid="rd-accordion-link-list"
      >
        <button
          type="button"
          class="rd-accordion__header"
          aria-expanded="${open ? 'true' : 'false'}"
          aria-controls="rd-accordion-link-list-panel"
        >
          <span class="rd-accordion__title">${escapeHtml(this.heading)}</span>
          <span class="rd-accordion__chevron" aria-hidden="true">›</span>
        </button>
        <div class="rd-accordion__panel" id="rd-accordion-link-list-panel" role="region">
          <ul class="rd-link-list${denseClass}">
            ${links}
          </ul>
        </div>
      </section>
    `;

    root.querySelector('button')?.addEventListener('click', () => this.toggle());
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
  defineRosettaElement(RD_ACCORDION_LINK_LIST_TAG, RdAccordionLinkListElement);
}
