import {
  buildEquirectExtractFilter,
  DEFAULT_EQUIRECT_FLAT_CROP,
} from '@dashbuilder/core';
import { BASE_STYLES, defineDashElement, type DashRow, readNumber, readString } from '../lib/element-utils';

export const DB_WASM_MEDIA_TAG = 'db-wasm-media';

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

export class DbWasmMediaElement extends HTMLElement {
  static readonly tagName = DB_WASM_MEDIA_TAG;

  private ffmpeg: FfmpegInstance | null = null;
  private inputFile: File | Blob | null = null;
  private cropRegion: DashRow | null = null;
  private busy = false;
  private progress = 0;
  private error: string | null = null;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.render();
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
    this.render();
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

  private render(): void {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    const progressMarkup =
      this.showProgress && this.operation === 'equirect-extract'
        ? `<div class="wasm-media__progress" role="progressbar" aria-valuenow="${this.progress}"><span style="width:${this.progress}%"></span></div>`
        : '';

    const actionMarkup =
      this.operation === 'equirect-extract'
        ? `<button type="button" data-role="extract" ${this.busy || !this.inputFile ? 'disabled' : ''}>${
            this.busy ? 'Extracting…' : 'Extract subsection'
          }</button>`
        : `<p class="wasm-media__hint">Set operation to equirect-extract and attach a video file.</p>`;

    root.innerHTML = `
      <style>${BASE_STYLES}
        .wasm-media__filter {
          display: block;
          margin: 0.5rem 0 0.75rem;
          padding: 0.5rem 0.625rem;
          border-radius: 0.375rem;
          background: rgb(15 23 42 / 6%);
          font: 0.6875rem/1.4 ui-monospace, monospace;
          word-break: break-all;
        }
        .wasm-media__progress {
          height: 0.375rem;
          border-radius: 999px;
          background: rgb(148 163 184 / 25%);
          overflow: hidden;
          margin-bottom: 0.75rem;
        }
        .wasm-media__progress span {
          display: block;
          height: 100%;
          background: #6366f1;
        }
        button {
          border: 0;
          border-radius: 0.375rem;
          padding: 0.5rem 0.875rem;
          background: #2563eb;
          color: #fff;
          font: inherit;
          cursor: pointer;
        }
        button:disabled { opacity: 0.55; cursor: not-allowed; }
        .wasm-media__error { color: #b91c1c; font-size: 0.8125rem; }
        .wasm-media__hint { color: var(--db-muted, #6b7280); font-size: 0.8125rem; }
      </style>
      <section class="panel wasm-media">
        <header class="panel__header">
          <h3>${this.label}</h3>
          <span class="panel__meta">${this.operation} → ${this.outputFormat}</span>
        </header>
        ${this.filterPreview ? `<code class="wasm-media__filter">${this.filterPreview}</code>` : ''}
        ${progressMarkup}
        ${actionMarkup}
        ${this.error ? `<p class="wasm-media__error">${this.error}</p>` : ''}
      </section>
    `;

    root.querySelector('[data-role="extract"]')?.addEventListener('click', () => {
      void this.runEquirectExtract();
    });
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
      this.render();
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
      this.render();
      return;
    }

    this.busy = true;
    this.error = null;
    this.progress = 0;
    this.render();

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
      this.render();
    }
  }
}

export function registerDbWasmMedia(): void {
  defineDashElement(DbWasmMediaElement.tagName, DbWasmMediaElement);
}
