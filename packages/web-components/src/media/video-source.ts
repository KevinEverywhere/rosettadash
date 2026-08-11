import { DEFAULT_EQUIRECT_SOURCE } from '@rosettadash/core';
import { BASE_STYLES, defineRosettaElement, type DashRow, readNumber, readString } from '../lib/element-utils';

export const DB_VIDEO_SOURCE_TAG = 'rd-video-source';

export class RdVideoSourceElement extends HTMLElement {
  static readonly tagName = DB_VIDEO_SOURCE_TAG;

  private inputEl: HTMLInputElement | null = null;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.render();
  }

  setProperty(name: string, value: unknown): void {
    (this as Record<string, unknown>)[name] = value;
    this.render();
  }

  get label(): string {
    return readString(this.getAttribute('label'), 'Video source');
  }

  get accept(): string {
    return readString(this.getAttribute('accept'), 'video/*');
  }

  get sourceWidth(): number {
    return readNumber(this.getAttribute('source-width'), DEFAULT_EQUIRECT_SOURCE.width);
  }

  get sourceHeight(): number {
    return readNumber(this.getAttribute('source-height'), DEFAULT_EQUIRECT_SOURCE.height);
  }

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    root.innerHTML = `
      <style>${BASE_STYLES}
        .media-source__upload {
          display: block;
          border: 1px dashed var(--db-border, #cbd5e1);
          border-radius: 0.375rem;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
        }
        .media-source__upload input { display: none; }
        .media-source__name { margin-top: 0.5rem; font-size: 0.8125rem; color: var(--db-muted, #6b7280); }
      </style>
      <section class="panel media-source">
        <header class="panel__header">
          <h3>${this.label}</h3>
          <span class="panel__meta">${this.sourceWidth}×${this.sourceHeight}</span>
        </header>
        <label class="media-source__upload">
          <input type="file" accept="${this.accept}" />
          <span>Choose video file</span>
        </label>
        <p class="media-source__name" data-role="file-name"></p>
      </section>
    `;

    this.inputEl = root.querySelector('input');
    this.inputEl?.addEventListener('change', () => this.handleFileSelected());
  }

  private handleFileSelected(): void {
    const file = this.inputEl?.files?.[0];
    if (!file) {
      return;
    }

    const nameEl = this.shadowRoot?.querySelector('[data-role="file-name"]');
    if (nameEl) {
      nameEl.textContent = file.name;
    }

    const metadata: DashRow = {
      name: file.name,
      sourceWidth: this.sourceWidth,
      sourceHeight: this.sourceHeight,
      size: file.size,
    };

    this.dispatchEvent(
      new CustomEvent('video-file', {
        detail: { file, metadata },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent('metadata', {
        detail: metadata,
        bubbles: true,
        composed: true,
      }),
    );
  }
}

export function registerRdVideoSource(): void {
  defineRosettaElement(RdVideoSourceElement.tagName, RdVideoSourceElement);
}
