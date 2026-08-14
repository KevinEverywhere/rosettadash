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

    void this.probeVideoDimensions(file).then(({ width, height }) => {
      if (width > 0 && height > 0) {
        this.setAttribute('source-width', String(width));
        this.setAttribute('source-height', String(height));
        const metaEl = this.shadowRoot?.querySelector('[data-ref="meta"]');
        if (metaEl) {
          metaEl.textContent = `${width}×${height}`;
        }
      }

      const metadata: DashRow = {
        name: file.name,
        sourceWidth: width > 0 ? width : this.sourceWidth,
        sourceHeight: height > 0 ? height : this.sourceHeight,
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
    });
  }

  private probeVideoDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;
        URL.revokeObjectURL(url);
        resolve({ width, height });
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: 0, height: 0 });
      };
      video.src = url;
    });
  }
}

export function registerRdVideoSource(): void {
  ensureShadowBase(DB_VIDEO_SOURCE_TAG);
  defineRosettaElement(RdVideoSourceElement.tagName, RdVideoSourceElement);
}
