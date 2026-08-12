import { DEFAULT_EQUIRECT_SOURCE } from '@rosettadash/core';
import { defineRosettaElement, type DashRow, readNumber, readString } from '../../../lib/element-utils.js';
import { applyShadowMount, ensureShadowBase, loadShadowPairForTag } from '../../../lib/shadow-base.js';

export const DB_VIDEO_SOURCE_TAG = 'rd-video-source';

export class RdVideoSourceElement extends HTMLElement {
  static readonly tagName = DB_VIDEO_SOURCE_TAG;

  private inputEl: HTMLInputElement | null = null;
  private resourcesReady: Promise<void> | null = null;
  private changeListener: (() => void) | null = null;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.resourcesReady = this.mountShadow();
    void this.resourcesReady.then(() => this.paint());
  }

  disconnectedCallback(): void {
    if (this.inputEl && this.changeListener) {
      this.inputEl.removeEventListener('change', this.changeListener);
    }
    this.changeListener = null;
    this.inputEl = null;
  }

  setProperty(name: string, value: unknown): void {
    (this as Record<string, unknown>)[name] = value;
    if (this.resourcesReady) {
      void this.resourcesReady.then(() => this.paint());
    }
  }

  whenReady(): Promise<void> {
    return this.resourcesReady ?? Promise.resolve();
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

  private async mountShadow(): Promise<void> {
    const root = this.shadowRoot;
    if (!root || root.querySelector('.video-source')) {
      return;
    }
    const pair = await loadShadowPairForTag(
      DB_VIDEO_SOURCE_TAG,
      './rd-video-source.html',
      './rd-video-source.css',
    );
    applyShadowMount(root, pair);
    this.inputEl = root.querySelector('[data-ref="input"]');
    this.changeListener = () => this.handleFileSelected();
    this.inputEl?.addEventListener('change', this.changeListener);
  }

  private paint(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const labelEl = root.querySelector('[data-ref="label"]');
    const metaEl = root.querySelector('[data-ref="meta"]');
    if (labelEl) {
      labelEl.textContent = this.label;
    }
    if (metaEl) {
      metaEl.textContent = `${this.sourceWidth}×${this.sourceHeight}`;
    }
    const input = root.querySelector('[data-ref="input"]') as HTMLInputElement | null;
    if (input) {
      input.accept = this.accept;
    }
  }

  private handleFileSelected(): void {
    const file = this.inputEl?.files?.[0];
    if (!file) {
      return;
    }

    const nameEl = this.shadowRoot?.querySelector('[data-ref="file-name"]');
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
  ensureShadowBase(DB_VIDEO_SOURCE_TAG);
  defineRosettaElement(RdVideoSourceElement.tagName, RdVideoSourceElement);
}
