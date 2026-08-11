import { DEFAULT_EQUIRECT_SOURCE } from '@rosettadash/core';
import { defineRosettaElement, type DashRow, readNumber, readString } from '../lib/element-utils';

export const DB_VIDEO_SOURCE_TAG = 'rd-video-source';
export const VIDEO_SOURCE_STYLESHEET = './video-source.css';

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
      <link rel="stylesheet" href="${VIDEO_SOURCE_STYLESHEET}" />
      <section class="video-source">
        <header class="video-source__header">
          <h3>${this.label}</h3>
          <span class="video-source__meta">${this.sourceWidth}×${this.sourceHeight}</span>
        </header>
        <label class="video-source__upload">
          <input type="file" accept="${this.accept}" />
          <span>Choose video file</span>
        </label>
        <p class="video-source__name" data-role="file-name"></p>
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
