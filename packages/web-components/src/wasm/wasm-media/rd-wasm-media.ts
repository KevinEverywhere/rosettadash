import {
  buildEquirectExtractFilter,
  DEFAULT_EQUIRECT_FLAT_CROP,
} from '@rosettadash/core';
import { defineRosettaElement, type DashRow, readNumber, readString } from '../../lib/element-utils.js';
import { applyShadowMount, ensureShadowBase, getShadowBase, loadShadowPairForTag } from '../../lib/shadow-base.js';
import { loadTextResource } from '../../lib/shadow-resources.js';

export const DB_WASM_MEDIA_TAG = 'rd-wasm-media';

type ExtractionMode = 'flat-crop' | 'rectilinear';

interface FfmpegModule {
  FFmpeg: new () => FfmpegInstance;
}

interface FfmpegUtilModule {
  fetchFile: (file: File | Blob) => Promise<Uint8Array>;
  toBlobURL: (url: string, mimeType: string) => Promise<string>;
}

interface FfmpegInstance {
  loaded: boolean;
  on(event: 'progress', handler: (payload: { progress: number }) => void): void;
  load(options: { coreURL: string; wasmURL: string }): Promise<void>;
  writeFile(name: string, data: Uint8Array): Promise<void>;
  readFile(name: string): Promise<Uint8Array>;
  exec(args: string[]): Promise<void>;
}

export class RdWasmMediaElement extends HTMLElement {
  static readonly tagName = DB_WASM_MEDIA_TAG;

  private ffmpeg: FfmpegInstance | null = null;
  private inputFile: File | Blob | null = null;
  private cropRegion: DashRow | null = null;
  private busy = false;
  private progress = 0;
  private error: string | null = null;
  private resourcesReady: Promise<void> | null = null;
  private extractListener: (() => void) | null = null;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.resourcesReady = this.mountShadow();
    void this.resourcesReady.then(() => this.paint());
  }

  disconnectedCallback(): void {
    const root = this.shadowRoot;
    const button = root?.querySelector('[data-role="extract"]');
    if (button && this.extractListener) {
      button.removeEventListener('click', this.extractListener);
    }
    this.extractListener = null;
  }

  setProperty(name: string, value: unknown): void {
    if (name === 'inputFile') {
      if (value instanceof Blob) {
        this.inputFile = value;
      } else if (value && typeof value === 'object' && 'file' in value) {
        const file = (value as { file?: File | Blob }).file;
        this.inputFile = file instanceof Blob ? file : null;
      } else {
        this.inputFile = null;
      }
    } else if (name === 'cropRegion' && value && typeof value === 'object') {
      this.cropRegion = value as DashRow;
    } else {
      const attrMap: Record<string, string> = {
        outputFormat: 'output-format',
        extractionMode: 'extraction-mode',
        cropX: 'crop-x',
        cropY: 'crop-y',
        cropWidth: 'crop-width',
        cropHeight: 'crop-height',
        outputWidth: 'output-width',
        outputHeight: 'output-height',
        horizontalFov: 'horizontal-fov',
        showProgress: 'show-progress',
      };
      const attr = attrMap[name] ?? name;
      if (value === null || value === undefined) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, String(value));
      }
    }
    if (this.resourcesReady) {
      void this.resourcesReady.then(() => this.paint());
    }
  }

  whenReady(): Promise<void> {
    return this.resourcesReady ?? Promise.resolve();
  }

  get label(): string {
    return readString(this.getAttribute('label'), 'Media transcode');
  }

  get operation(): string {
    return readString(this.getAttribute('operation'), 'transcode');
  }

  get extractionMode(): ExtractionMode {
    const mode = readString(this.getAttribute('extraction-mode'), 'flat-crop');
    return mode === 'rectilinear' ? 'rectilinear' : 'flat-crop';
  }

  get outputFormat(): string {
    return readString(this.getAttribute('output-format'), 'mp4');
  }

  get showProgress(): boolean {
    return this.getAttribute('show-progress') !== 'false';
  }

  get filterPreview(): string {
    if (this.operation !== 'equirect-extract') {
      return '';
    }
    const crop = this.resolveCrop();
    return buildEquirectExtractFilter(this.extractionMode, {
      ...crop,
      yaw: readNumber(this.getAttribute('yaw'), 0),
      pitch: readNumber(this.getAttribute('pitch'), 0),
      horizontalFov: readNumber(this.getAttribute('horizontal-fov'), 90),
    });
  }

  private resolveCrop() {
    return {
      cropX: readNumber(this.cropRegion?.['cropX'] ?? this.getAttribute('crop-x'), DEFAULT_EQUIRECT_FLAT_CROP.cropX),
      cropY: readNumber(this.cropRegion?.['cropY'] ?? this.getAttribute('crop-y'), DEFAULT_EQUIRECT_FLAT_CROP.cropY),
      cropWidth: readNumber(
        this.cropRegion?.['cropWidth'] ?? this.getAttribute('crop-width'),
        DEFAULT_EQUIRECT_FLAT_CROP.cropWidth,
      ),
      cropHeight: readNumber(
        this.cropRegion?.['cropHeight'] ?? this.getAttribute('crop-height'),
        DEFAULT_EQUIRECT_FLAT_CROP.cropHeight,
      ),
      outputWidth: readNumber(
        this.cropRegion?.['outputWidth'] ?? this.getAttribute('output-width'),
        DEFAULT_EQUIRECT_FLAT_CROP.outputWidth,
      ),
      outputHeight: readNumber(
        this.cropRegion?.['outputHeight'] ?? this.getAttribute('output-height'),
        DEFAULT_EQUIRECT_FLAT_CROP.outputHeight,
      ),
    };
  }

  private async mountShadow(): Promise<void> {
    const root = this.shadowRoot;
    if (!root || root.querySelector('[data-ref="root"]')) {
      return;
    }
    const pair = await loadShadowPairForTag(
      DB_WASM_MEDIA_TAG,
      './rd-wasm-media.html',
      './rd-wasm-media.css',
    );
    const panelCss = await loadTextResource('../../lib/panel.css', getShadowBase(DB_WASM_MEDIA_TAG));
    applyShadowMount(root, { html: pair.html, css: `${panelCss}\n${pair.css}` });
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
      metaEl.textContent = `${this.operation} → ${this.outputFormat}`;
    }

    const filterEl = root.querySelector('[data-ref="filter"]') as HTMLElement;
    if (this.filterPreview) {
      filterEl.hidden = false;
      filterEl.textContent = this.filterPreview;
    } else {
      filterEl.hidden = true;
    }

    const progressEl = root.querySelector('[data-ref="progress"]') as HTMLElement;
    const progressBar = root.querySelector('[data-ref="progress-bar"]') as HTMLElement;
    if (this.showProgress && this.operation === 'equirect-extract') {
      progressEl.hidden = false;
      progressEl.setAttribute('aria-valuenow', String(this.progress));
      progressBar.style.width = `${this.progress}%`;
    } else {
      progressEl.hidden = true;
    }

    const actions = root.querySelector('[data-ref="actions"]');
    if (actions) {
      if (this.operation === 'equirect-extract') {
        actions.innerHTML = `<button type="button" data-role="extract" ${
          this.busy || !this.inputFile ? 'disabled' : ''
        }>${this.busy ? 'Extracting…' : 'Extract subsection'}</button>`;
      } else {
        actions.innerHTML =
          '<p class="wasm-media__hint">Set operation to equirect-extract and attach a video file.</p>';
      }
    }

    const errorEl = root.querySelector('[data-ref="error"]') as HTMLElement;
    if (this.error) {
      errorEl.hidden = false;
      errorEl.textContent = this.error;
    } else {
      errorEl.hidden = true;
    }

    const button = root.querySelector('[data-role="extract"]');
    if (button) {
      if (this.extractListener) {
        button.removeEventListener('click', this.extractListener);
      }
      this.extractListener = () => {
        void this.runEquirectExtract();
      };
      button.addEventListener('click', this.extractListener);
    }
  }

  private async ensureFfmpeg(): Promise<FfmpegInstance> {
    if (this.ffmpeg?.loaded) {
      return this.ffmpeg;
    }

    let ffmpegModule: FfmpegModule;
    let utilModule: FfmpegUtilModule;
    try {
      ffmpegModule = (await import('@ffmpeg/ffmpeg')) as FfmpegModule;
      utilModule = (await import('@ffmpeg/util')) as FfmpegUtilModule;
    } catch {
      throw new Error('Install @ffmpeg/ffmpeg and @ffmpeg/util to run equirect extract.');
    }

    const ffmpeg = new ffmpegModule.FFmpeg();
    ffmpeg.on('progress', ({ progress }) => {
      this.progress = Math.round(progress * 100);
      this.dispatchEvent(
        new CustomEvent('progress', {
          detail: { progress: this.progress },
          bubbles: true,
          composed: true,
        }),
      );
      this.paint();
    });

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await utilModule.toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await utilModule.toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    this.ffmpeg = ffmpeg;
    return ffmpeg;
  }

  async runEquirectExtract(): Promise<void> {
    if (!this.inputFile) {
      this.error = 'Attach a video file before extracting.';
      this.paint();
      return;
    }

    this.busy = true;
    this.error = null;
    this.progress = 0;
    this.paint();

    try {
      const ffmpeg = await this.ensureFfmpeg();
      const utilModule = (await import('@ffmpeg/util')) as FfmpegUtilModule;
      const inputName = 'input.mp4';
      const outputName = `output.${this.outputFormat}`;
      const crop = this.resolveCrop();
      const filter = buildEquirectExtractFilter(this.extractionMode, {
        ...crop,
        yaw: readNumber(this.getAttribute('yaw'), 0),
        pitch: readNumber(this.getAttribute('pitch'), 0),
        horizontalFov: readNumber(this.getAttribute('horizontal-fov'), 90),
      });

      await ffmpeg.writeFile(inputName, await utilModule.fetchFile(this.inputFile));
      await ffmpeg.exec(['-i', inputName, '-vf', filter, '-c:a', 'copy', outputName]);
      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([Uint8Array.from(data)], { type: `video/${this.outputFormat}` });
      const metadata: DashRow = {
        filter,
        outputWidth: crop.outputWidth,
        outputHeight: crop.outputHeight,
        format: this.outputFormat,
      };

      this.dispatchEvent(
        new CustomEvent('extract-complete', {
          detail: { blob, metadata },
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
    } catch (nextError) {
      this.error = nextError instanceof Error ? nextError.message : 'Extract failed';
    } finally {
      this.busy = false;
      this.paint();
    }
  }
}

export function registerRdWasmMedia(): void {
  ensureShadowBase(DB_WASM_MEDIA_TAG);
  defineRosettaElement(RdWasmMediaElement.tagName, RdWasmMediaElement);
}
