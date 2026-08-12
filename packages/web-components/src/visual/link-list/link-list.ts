import { defineRosettaElement, readString } from '../../lib/element-utils';

export const RD_LINK_LIST_TAG = 'rd-link-list';

/** Single link item for visual/link-list. */
export interface LinkListItem {
  label: string;
  href: string;
}

/** Public props contract for visual/link-list (all runtimes share this shape). */
export interface LinkListProps {
  items?: LinkListItem[];
  className?: string;
  /** When true, render a denser list. */
  dense?: boolean;
}

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

export class RdLinkListElement extends HTMLElement {
  static readonly tagName = RD_LINK_LIST_TAG;

  private itemsValue: LinkListItem[] = [];

  static get observedAttributes(): string[] {
    return ['items', 'dense'];
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
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

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

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
        .rd-link-list {
          margin: 0;
          padding: 0;
          list-style: none;
          color: var(--rd-color-text, #1a1a1a);
          font-family: var(--rd-font-family, system-ui, sans-serif);
          font-size: var(--rd-font-size, 0.875rem);
          line-height: var(--rd-line-height, 1.4);
        }
        .rd-link-list__item + .rd-link-list__item {
          margin-top: var(--rd-space-xs, 0.25rem);
        }
        .rd-link-list--dense .rd-link-list__item + .rd-link-list__item {
          margin-top: 0;
        }
        .rd-link-list__link {
          color: var(--rd-color-accent, #2563eb);
          text-decoration: none;
        }
        .rd-link-list__link:hover,
        .rd-link-list__link:focus-visible {
          text-decoration: underline;
        }
      </style>
      <ul class="rd-link-list${denseClass}" data-testid="rd-link-list">
        ${links}
      </ul>
    `;
  }
}

export function registerRdLinkList(): void {
  defineRosettaElement(RD_LINK_LIST_TAG, RdLinkListElement);
}
