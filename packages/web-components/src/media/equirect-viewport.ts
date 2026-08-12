import {
  buildEquirectExtractFilter,
  DEFAULT_EQUIRECT_FLAT_CROP,
  DEFAULT_EQUIRECT_SOURCE,
} from '@rosettadash/core';
import { BASE_STYLES, defineRosettaElement, type DashRow, readNumber, readString } from '../lib/element-utils';

export const DB_EQUIRECT_VIEWPORT_TAG = 'rd-equirect-viewport';

export type EquirectPreviewMode = 'flat-crop' | 'rectilinear';

export class RdEquirectViewportElement extends HTMLElement {
  static readonly tagName = DB_EQUIRECT_VIEWPORT_TAG;

  static get observedAttributes(): string[] {
    return [
      'label',
      'preview-mode',
      'source-width',
      'source-height',
      'crop-x',
      'crop-y',
      'crop-width',
      'crop-height',
      'output-width',
      'output-height',
      'yaw',
      'pitch',
      'horizontal-fov',
    ];
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.render();
    this.emitCropRegion();
  }

  attributeChangedCallback(): void {
    if (this.shadowRoot) {
      this.render();
      this.emitCropRegion();
    }
  }

  setProperty(name: string, value: unknown): void {
    const attrMap: Record<string, string> = {
      previewMode: 'preview-mode',
      sourceWidth: 'source-width',
      sourceHeight: 'source-height',
      cropX: 'crop-x',
      cropY: 'crop-y',
      cropWidth: 'crop-width',
      cropHeight: 'crop-height',
      outputWidth: 'output-width',
      outputHeight: 'output-height',
      horizontalFov: 'horizontal-fov',
    };

    const attr = attrMap[name] ?? name;
    if (value === null || value === undefined) {
      this.removeAttribute(attr);
    } else {
      this.setAttribute(attr, String(value));
    }
  }

  get previewMode(): EquirectPreviewMode {
    const mode = readString(this.getAttribute('preview-mode'), 'flat-crop');
    return mode === 'rectilinear' ? 'rectilinear' : 'flat-crop';
  }

  get label(): string {
    return readString(this.getAttribute('label'), 'Equirect viewport');
  }

  get cropRegion(): DashRow {
    return {
      cropX: this.cropX,
      cropY: this.cropY,
      cropWidth: this.cropWidth,
      cropHeight: this.cropHeight,
      outputWidth: this.outputWidth,
      outputHeight: this.outputHeight,
      yaw: this.yaw,
      pitch: this.pitch,
      horizontalFov: this.horizontalFov,
      previewMode: this.previewMode,
      filter: buildEquirectExtractFilter(this.previewMode, {
        cropX: this.cropX,
        cropY: this.cropY,
        cropWidth: this.cropWidth,
        cropHeight: this.cropHeight,
        outputWidth: this.outputWidth,
        outputHeight: this.outputHeight,
        yaw: this.yaw,
        pitch: this.pitch,
        horizontalFov: this.horizontalFov,
      }),
    };
  }

  private get sourceWidth(): number {
    return readNumber(this.getAttribute('source-width'), DEFAULT_EQUIRECT_SOURCE.width);
  }

  private get sourceHeight(): number {
    return readNumber(this.getAttribute('source-height'), DEFAULT_EQUIRECT_SOURCE.height);
  }

  private get cropX(): number {
    return readNumber(this.getAttribute('crop-x'), DEFAULT_EQUIRECT_FLAT_CROP.cropX);
  }

  private get cropY(): number {
    return readNumber(this.getAttribute('crop-y'), DEFAULT_EQUIRECT_FLAT_CROP.cropY);
  }

  private get cropWidth(): number {
    return readNumber(this.getAttribute('crop-width'), DEFAULT_EQUIRECT_FLAT_CROP.cropWidth);
  }

  private get cropHeight(): number {
    return readNumber(this.getAttribute('crop-height'), DEFAULT_EQUIRECT_FLAT_CROP.cropHeight);
  }

  private get outputWidth(): number {
    return readNumber(this.getAttribute('output-width'), DEFAULT_EQUIRECT_FLAT_CROP.outputWidth);
  }

  private get outputHeight(): number {
    return readNumber(this.getAttribute('output-height'), DEFAULT_EQUIRECT_FLAT_CROP.outputHeight);
  }

  private get yaw(): number {
    return readNumber(this.getAttribute('yaw'), 0);
  }

  private get pitch(): number {
    return readNumber(this.getAttribute('pitch'), 0);
  }

  private get horizontalFov(): number {
    return readNumber(this.getAttribute('horizontal-fov'), 90);
  }

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const cropLeftPct = (this.cropX / this.sourceWidth) * 100;
    const cropTopPct = (this.cropY / this.sourceHeight) * 100;
    const cropWidthPct = (this.cropWidth / this.sourceWidth) * 100;
    const cropHeightPct = (this.cropHeight / this.sourceHeight) * 100;

    const flatPreview = `
      <div class="equirect-frame" style="aspect-ratio: ${this.sourceWidth} / ${this.sourceHeight}">
        <div class="equirect-frame__crop" style="left:${cropLeftPct}%;top:${cropTopPct}%;width:${cropWidthPct}%;height:${cropHeightPct}%"></div>
      </div>
    `;

    const rectilinearPreview = `
      <div class="rectilinear-preview">
        <div class="rectilinear-preview__cone" style="transform: rotateY(${this.yaw}deg) rotateX(${-this.pitch}deg)"></div>
        <dl class="rectilinear-preview__meta">
          <div><dt>Yaw</dt><dd>${this.yaw}°</dd></div>
          <div><dt>Pitch</dt><dd>${this.pitch}°</dd></div>
          <div><dt>FOV</dt><dd>${this.horizontalFov}°</dd></div>
        </dl>
      </div>
    `;

    root.innerHTML = `
      <style>${BASE_STYLES}
        .equirect-frame {
          position: relative;
          width: 100%;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          border-radius: 0.375rem;
          overflow: hidden;
        }
        .equirect-frame__crop {
          position: absolute;
          border: 2px solid #38bdf8;
          box-shadow: 0 0 0 9999px rgb(15 23 42 / 55%);
          box-sizing: border-box;
        }
        .rectilinear-preview {
          display: grid;
          gap: 0.75rem;
          grid-template-columns: 1fr 1fr;
          align-items: center;
        }
        .rectilinear-preview__cone {
          width: 4rem;
          height: 4rem;
          margin: 0 auto;
          background: conic-gradient(from 210deg, #38bdf8, #6366f1, #38bdf8);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          transform-origin: 50% 85%;
        }
        .rectilinear-preview__meta {
          margin: 0;
          display: grid;
          gap: 0.375rem;
          font-size: 0.8125rem;
        }
        .rectilinear-preview__meta div {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .rectilinear-preview__meta dt {
          margin: 0;
          color: var(--rd-color-muted, #6b7280);
        }
        .rectilinear-preview__meta dd {
          margin: 0;
          font-weight: 600;
        }
        .filter-preview {
          margin-top: 0.75rem;
          padding: 0.5rem 0.625rem;
          border-radius: 0.375rem;
          background: rgb(15 23 42 / 6%);
          font: 0.6875rem/1.4 ui-monospace, monospace;
          word-break: break-all;
        }
      </style>
      <section class="panel equirect-viewport">
        <header class="panel__header">
          <h3>${this.label}</h3>
          <span class="panel__meta">${this.previewMode === 'flat-crop' ? 'Flat crop' : 'Rectilinear'}</span>
        </header>
        ${this.previewMode === 'flat-crop' ? flatPreview : rectilinearPreview}
        <code class="filter-preview">${this.cropRegion['filter']}</code>
        <p class="panel__meta">Output ${this.outputWidth}×${this.outputHeight}</p>
      </section>
    `;
  }

  private emitCropRegion(): void {
    this.dispatchEvent(
      new CustomEvent('crop-region', {
        detail: this.cropRegion,
        bubbles: true,
        composed: true,
      }),
    );
  }
}

export function registerRdEquirectViewport(): void {
  defineRosettaElement(RdEquirectViewportElement.tagName, RdEquirectViewportElement);
}
