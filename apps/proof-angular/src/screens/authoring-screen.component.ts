import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  AUTHORING_OUTPUT_CUSTOM_ID,
  AUTHORING_OUTPUT_PRESETS,
  getAuthoringOutputPreset,
  virtualCameraToCropRegion,
} from '@rosettadash/core';
import { EquirectSphereViewport } from '@rosettadash/angular/visual/media/equirect-sphere-viewport';
import { VideoSource, type VideoFileDetail } from '@rosettadash/angular/visual/media/video-source';
import { WasmMedia } from '@rosettadash/angular/visual/wasm/media';
import {
  DEFAULT_AUTHORING_EXAMPLE_ID,
  DESTINATION_ATLAS_AUTHORING_EXAMPLES,
  getAuthoringExampleById,
  getAuthoringExampleForDestinationId,
  getDestinationById,
  resolveEquirectSourceVideoUrl,
} from '@destination-atlas';
import { localizedDestinationName } from '../lib/atlas-utils';
import { AtlasStateService } from '../services/atlas-state.service';
import { AuthoringPlaybackBarComponent } from '../components/authoring-playback-bar.component';
import { AuthoringCameraControlsComponent } from '../components/authoring-camera-controls.component';
import { DaBoundSelectInputComponent } from '../components/proof-form-fields.component';

type CropRegion = Record<string, string | number | boolean | null | undefined>;

function matchOutputPreset(width: number, height: number): string {
  const match = AUTHORING_OUTPUT_PRESETS.find(
    (entry) => entry.width === width && entry.height === height,
  );
  return match?.id ?? AUTHORING_OUTPUT_CUSTOM_ID;
}

@Component({
  selector: 'da-authoring-screen',
  standalone: true,
  imports: [
    EquirectSphereViewport,
    VideoSource,
    WasmMedia,
    AuthoringPlaybackBarComponent,
    AuthoringCameraControlsComponent,
    DaBoundSelectInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="da-panel da-panel--authoring">
      <h2>Authoring</h2>
      <p>
        Upload a 2:1 equirectangular video, use playback and record under the source view, and frame with the
        camera sliders or by dragging inside the sphere. The output pane mirrors the same view at export size.
      </p>

      <da-bound-select-input
        [fieldLabel]="'Shipped example'"
        [options]="exampleOptions()"
        [value]="exampleId()"
        (valueChange)="exampleId.set($event)"
      />
      @if (example(); as activeExample) {
        <p class="da-note">{{ activeExample.summary }}</p>
      }
      @if (sourceLoadBusy()) {
        <p class="da-note" aria-live="polite">Loading shipped 360° source…</p>
      }
      @if (sourceLoadError(); as error) {
        <p class="da-note da-note--warn" role="alert">
          Shipped video fetch failed ({{ error }}). Choose a local 2:1 equirect file below.
        </p>
      }

      <section class="da-authoring-upload-panel" aria-label="Source video file">
        <h3 class="da-authoring-upload-panel__title">Source video</h3>
        <p class="da-note">
          Pick a local 2:1 equirect MP4/WebM, or use the shipped example when available at
          <code>/media/cusco-plaza-360.webm</code>.
        </p>
        <rd-video-source
          class="da-authoring-upload"
          label="Authoring video file"
          accept="video/*"
          [sourceWidth]="sourceWidth()"
          [sourceHeight]="sourceHeight()"
          (videoFile)="handleVideoFile($event)"
        />
        @if (inputFile(); as file) {
          <p class="da-note">
            Loaded: <strong>{{ file.name }}</strong>
            @if (sourceWidth() && sourceHeight()) {
              ({{ sourceWidth() }}×{{ sourceHeight() }})
            }
          </p>
        }
      </section>

      <div class="da-authoring-workspace">
        <header class="da-authoring-workspace__headers">
          <h3 class="da-authoring-pane__title">Source — {{ exampleLabel() }}</h3>
          <h3 class="da-authoring-pane__title">Output</h3>
        </header>

        <div class="da-authoring-workspace__videos">
          <div class="da-authoring-workspace__video-col">
            @if (isEquirectExample()) {
              @if (sourceUrl()) {
                <rd-equirect-sphere-viewport
                  #sphereViewport
                  class="da-authoring-sphere-viewport"
                  [videoSrc]="sourceUrl()"
                  [flipInterior]="true"
                  [yaw]="yaw()"
                  [pitch]="pitch()"
                  [horizontalFov]="horizontalFov()"
                  [outputWidth]="outputWidth()"
                  [outputHeight]="outputHeight()"
                  [outputPreviewElement]="outputPreviewElement()"
                  (cameraChange)="onCameraChange($event)"
                />
              } @else if (sourceLoadBusy()) {
                <div class="da-authoring-sphere-viewport da-authoring-sphere-viewport--placeholder">
                  <p class="da-authoring-output-placeholder">Loading shipped 360° source…</p>
                </div>
              } @else {
                <div class="da-authoring-sphere-viewport da-authoring-sphere-viewport--placeholder">
                  <p class="da-authoring-output-placeholder">
                    Choose a local equirect (2:1) video to open the sphere view.
                  </p>
                </div>
              }
            } @else {
              <div class="da-authoring-sphere-viewport da-authoring-sphere-viewport--placeholder">
                <p class="da-authoring-output-placeholder">Select an equirect shipped example.</p>
              </div>
            }
          </div>

          <div class="da-authoring-workspace__video-col">
            <div #outputPreviewHost class="da-authoring-program-preview-host">
              @if (!sourceUrl()) {
                <p class="da-authoring-output-placeholder">Load source video to preview output.</p>
              }
            </div>
          </div>
        </div>

        <div class="da-authoring-workspace__footers">
          <div class="da-authoring-pane da-authoring-pane--source" aria-label="Authoring source controls">
            <da-authoring-playback-bar
              [viewport]="viewportRef()"
              [disabled]="!sourceUrl()"
              (resetView)="resetView()"
            />
            <da-authoring-camera-controls
              [yaw]="yaw()"
              [pitch]="pitch()"
              [horizontalFov]="horizontalFov()"
              [disabled]="!sourceUrl() || !isEquirectExample()"
              (yawChange)="yaw.set($event)"
              (pitchChange)="pitch.set($event)"
              (horizontalFovChange)="horizontalFov.set($event)"
              (reset)="resetView()"
            />
          </div>

          <div class="da-authoring-pane da-authoring-pane--output" aria-label="Authoring output controls">
            <p class="da-note">Same view as source — live mirror scaled to export dimensions.</p>

            @if (sourceWidth() && sourceHeight()) {
              <p class="da-note" [class.da-note--warn]="equirectAspectWarning()">
                Source dimensions: {{ sourceWidth() }}×{{ sourceHeight() }} ({{ sourceAspect()?.toFixed(2) }}:1)
                @if (isEquirectExample()) {
                  — interior view flips texture for inside-out viewing
                }
                @if (equirectAspectWarning()) {
                  · aspect ratio differs from 2:1; extract may look wrong
                }
              </p>
            }

            <div class="da-media-extract-controls">
              <da-bound-select-input
                [fieldLabel]="'Export rectangle size'"
                [options]="outputPresetOptions()"
                [value]="outputPresetId()"
                (valueChange)="handleOutputPresetChange($event)"
              />
              <section class="rd-input-number">
                <span class="rd-field__label">Yaw (°)</span>
                <input type="number" class="rd-input" step="0.5" min="-180" max="180" [value]="formatDegree(yaw())" (change)="yaw.set(+$any($event.target).value)" />
              </section>
              <section class="rd-input-number">
                <span class="rd-field__label">Pitch (°)</span>
                <input type="number" class="rd-input" step="0.5" min="-85" max="85" [value]="formatDegree(pitch())" (change)="pitch.set(+$any($event.target).value)" />
              </section>
              <section class="rd-input-number">
                <span class="rd-field__label">Horizontal FOV (°)</span>
                <input type="number" class="rd-input" step="1" min="30" max="360" [value]="horizontalFov()" (change)="horizontalFov.set(+$any($event.target).value)" />
              </section>
              <section class="rd-input-number">
                <span class="rd-field__label">Output width</span>
                <input
                  type="number"
                  class="rd-input"
                  step="2"
                  min="160"
                  max="3840"
                  [value]="outputWidth()"
                  [disabled]="!isCustomOutput()"
                  (change)="handleCustomDimensionChange(+$any($event.target).value, outputHeight())"
                />
              </section>
              <section class="rd-input-number">
                <span class="rd-field__label">Output height</span>
                <input
                  type="number"
                  class="rd-input"
                  step="2"
                  min="120"
                  max="2160"
                  [value]="outputHeight()"
                  [disabled]="!isCustomOutput()"
                  (change)="handleCustomDimensionChange(outputWidth(), +$any($event.target).value)"
                />
              </section>
              <label class="rd-input-checkbox">
                <input type="checkbox" [checked]="reverse()" (change)="reverse.set($any($event.target).checked)" />
                Reverse playback
              </label>
            </div>

            @if (extractFilter()) {
              <p class="da-note da-note--filter">
                Filter:
                <code class="da-value-ellipsis" tabindex="0">{{ extractFilter() }}</code>
              </p>
            }

            @if (inputFile()) {
              <rd-wasm-media
                label="ffmpeg.wasm extract"
                operation="equirect-extract"
                extractionMode="rectilinear"
                outputFormat="mp4"
                [showProgress]="true"
                [yaw]="yaw()"
                [pitch]="pitch()"
                [horizontalFov]="horizontalFov()"
                [outputWidth]="outputWidth()"
                [outputHeight]="outputHeight()"
                [reverse]="reverse()"
                [inputFile]="inputFile()"
                [cropRegion]="cropRegion()"
                (progress)="onExtractProgress($event)"
                (extractComplete)="onExtractComplete($event)"
                (extractError)="onExtractError($event)"
              />
            } @else {
              <p class="da-note">Attach a video file to enable ffmpeg.wasm extract.</p>
            }

            @if (extractBusy()) {
              <p class="da-note" aria-live="polite">
                Extracting…
                @if (extractProgress() > 0) {
                  {{ extractProgress() }}%
                } @else {
                  loading ffmpeg.wasm (~31 MB first run)
                }
              </p>
            }
            @if (extractError(); as error) {
              <p class="da-note da-note--warn" role="alert">Extract failed: {{ error }}</p>
            }
            @if (extractUrl(); as url) {
              <p class="da-note">Extracted MP4 (ffmpeg.wasm):</p>
              <video class="da-authoring-pane__video" [src]="url" controls playsinline autoplay muted></video>
              <a class="da-media-extract-output__download" [href]="url" [download]="downloadName()">
                Download extracted video
              </a>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AuthoringScreenComponent {
  readonly atlas = inject(AtlasStateService);

  readonly exampleId = signal(DEFAULT_AUTHORING_EXAMPLE_ID);
  readonly inputFile = signal<File | null>(null);
  readonly sourceUrl = signal<string | null>(null);
  readonly sourceLoadBusy = signal(false);
  readonly sourceLoadError = signal<string | null>(null);
  readonly cropRegion = signal<CropRegion | null>(null);
  readonly extractUrl = signal<string | null>(null);
  readonly extractFilter = signal('');
  readonly extractProgress = signal(0);
  readonly extractError = signal<string | null>(null);
  readonly extractBusy = signal(false);

  readonly yaw = signal(25);
  readonly pitch = signal(-8);
  readonly horizontalFov = signal(75);
  readonly outputWidth = signal(720);
  readonly outputHeight = signal(480);
  readonly outputPresetId = signal('720x480');
  readonly reverse = signal(false);
  readonly sourceWidth = signal<number | undefined>(undefined);
  readonly sourceHeight = signal<number | undefined>(undefined);

  private userPickedFile = false;

  private objectUrl: string | null = null;
  private extractObjectUrl: string | null = null;

  readonly sphereViewport = viewChild<EquirectSphereViewport>('sphereViewport');
  readonly outputPreviewHostEl = viewChild<ElementRef<HTMLElement>>('outputPreviewHost');

  readonly example = computed(
    () => getAuthoringExampleById(this.exampleId()) ?? DESTINATION_ATLAS_AUTHORING_EXAMPLES[0],
  );

  readonly exampleOptions = computed(() =>
    DESTINATION_ATLAS_AUTHORING_EXAMPLES.map((entry) => ({
      value: entry.id,
      label: entry.label,
    })),
  );

  readonly isEquirectExample = computed(() => this.example()?.projection === 'equirect');

  readonly isCustomOutput = computed(() => this.outputPresetId() === AUTHORING_OUTPUT_CUSTOM_ID);

  readonly sourceAspect = computed(() => {
    const width = this.sourceWidth();
    const height = this.sourceHeight();
    return width && height && height > 0 ? width / height : null;
  });

  readonly equirectAspectWarning = computed(
    () =>
      this.isEquirectExample() &&
      this.sourceAspect() !== null &&
      Math.abs(this.sourceAspect()! - 2) > 0.05,
  );

  readonly exampleLabel = computed(() => {
    const example = this.example();
    const destination = example ? getDestinationById(example.destinationId) : undefined;
    if (!example || !destination) {
      return example?.label ?? 'Authoring example';
    }
    return `${example.label} · ${localizedDestinationName(destination, this.atlas.locale())}`;
  });

  readonly outputPresetOptions = computed(() => [
    ...AUTHORING_OUTPUT_PRESETS.map((entry) => ({ value: entry.id, label: entry.label })),
    { value: AUTHORING_OUTPUT_CUSTOM_ID, label: 'Custom' },
  ]);

  readonly downloadName = computed(() => `${this.example()?.id ?? 'authoring'}-extract.mp4`);

  constructor() {
    effect(() => {
      const selectedId = this.atlas.selectedId();
      if (!selectedId) {
        return;
      }
      const linkedExample = getAuthoringExampleForDestinationId(selectedId);
      if (linkedExample) {
        this.exampleId.set(linkedExample.id);
      }
    });

    effect(() => {
      this.atlas.selectedId();
      this.exampleId();
      this.userPickedFile = false;
    });

    effect((onCleanup) => {
      const example = this.example();
      const selectedId = this.atlas.selectedId();
      if (!example) {
        return;
      }

      if (!this.userPickedFile) {
        this.yaw.set(example.defaultYaw);
        this.pitch.set(example.defaultPitch);
        this.horizontalFov.set(example.defaultHorizontalFov);
        const preset = getAuthoringOutputPreset('720x480');
        this.outputPresetId.set('720x480');
        this.outputWidth.set(preset?.width ?? 720);
        this.outputHeight.set(preset?.height ?? 480);
        this.sourceWidth.set(undefined);
        this.sourceHeight.set(undefined);
        this.cropRegion.set(null);
        this.extractFilter.set('');
        this.extractProgress.set(0);
        this.extractError.set(null);
        this.extractBusy.set(false);
        this.revokeExtractUrl();
      }

      const destination = selectedId ? getDestinationById(selectedId) : undefined;
      const shippedUrl = resolveEquirectSourceVideoUrl(destination);
      const shouldLoadShipped =
        Boolean(selectedId) && example.destinationId === selectedId && Boolean(shippedUrl);

      if (this.userPickedFile || !shouldLoadShipped || !shippedUrl || !destination) {
        if (!this.userPickedFile) {
          this.inputFile.set(null);
          this.sourceUrl.set(null);
          this.sourceLoadBusy.set(false);
          this.sourceLoadError.set(null);
        }
        return;
      }

      let cancelled = false;
      this.sourceLoadError.set(null);
      this.sourceLoadBusy.set(true);
      this.inputFile.set(null);
      this.sourceUrl.set(null);

      void (async () => {
        try {
          const response = await fetch(shippedUrl);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const blob = await response.blob();
          if (cancelled || this.userPickedFile) {
            return;
          }
          const ext = shippedUrl.includes('.webm') ? 'webm' : 'mp4';
          this.inputFile.set(
            new File([blob], `${destination.id}-equirect.${ext}`, {
              type: blob.type || `video/${ext}`,
            }),
          );
        } catch (error) {
          if (cancelled) {
            return;
          }
          this.sourceLoadError.set(
            error instanceof Error ? error.message : 'Could not load shipped 360° video',
          );
          this.sourceUrl.set(shippedUrl);
        } finally {
          if (!cancelled) {
            this.sourceLoadBusy.set(false);
          }
        }
      })();

      onCleanup(() => {
        cancelled = true;
      });
    });

    effect((onCleanup) => {
      const file = this.inputFile();
      if (!file) {
        return;
      }
      const url = URL.createObjectURL(file);
      this.objectUrl = url;
      this.sourceUrl.set(url);
      onCleanup(() => {
        URL.revokeObjectURL(url);
        if (this.objectUrl === url) {
          this.objectUrl = null;
        }
      });
    });

    effect(() => {
      const region = virtualCameraToCropRegion({
        camera: { yaw: this.yaw(), pitch: this.pitch(), roll: 0, fov: this.horizontalFov() },
        sourceWidth: this.sourceWidth(),
        sourceHeight: this.sourceHeight(),
        outputWidth: this.outputWidth(),
        outputHeight: this.outputHeight(),
        reverse: this.reverse(),
      });
      this.cropRegion.set(region);
      const filter = region.filter;
      this.extractFilter.set(typeof filter === 'string' ? filter : '');
    });
  }

  viewportRef(): EquirectSphereViewport | null {
    return this.sphereViewport() ?? null;
  }

  outputPreviewElement(): HTMLElement | null {
    return this.outputPreviewHostEl()?.nativeElement ?? null;
  }

  formatDegree(value: number): number {
    return Math.round(value * 10) / 10;
  }

  onCameraChange(detail: { yaw: number; pitch: number; horizontalFov: number }): void {
    this.yaw.set(detail.yaw);
    this.pitch.set(detail.pitch);
    this.horizontalFov.set(detail.horizontalFov);
  }

  handleOutputPresetChange(presetId: string): void {
    this.outputPresetId.set(presetId);
    if (presetId === AUTHORING_OUTPUT_CUSTOM_ID) {
      return;
    }
    const preset = getAuthoringOutputPreset(presetId);
    if (preset) {
      this.outputWidth.set(preset.width);
      this.outputHeight.set(preset.height);
    }
  }

  handleCustomDimensionChange(width: number, height: number): void {
    if (!this.isCustomOutput()) {
      return;
    }
    this.outputWidth.set(width);
    this.outputHeight.set(height);
    this.outputPresetId.set(matchOutputPreset(width, height));
  }

  handleVideoFile(detail: VideoFileDetail): void {
    this.userPickedFile = true;
    this.sourceLoadBusy.set(false);
    this.sourceLoadError.set(null);
    this.inputFile.set(detail.file);
    const example = this.example();
    if (example) {
      this.yaw.set(example.defaultYaw);
      this.pitch.set(example.defaultPitch);
      this.horizontalFov.set(example.defaultHorizontalFov);
    }
    const width = Number(detail.metadata.sourceWidth);
    const height = Number(detail.metadata.sourceHeight);
    if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
      this.sourceWidth.set(width);
      this.sourceHeight.set(height);
    } else {
      this.sourceWidth.set(undefined);
      this.sourceHeight.set(undefined);
    }
    this.revokeExtractUrl();
    this.extractProgress.set(0);
    this.extractError.set(null);
    this.extractBusy.set(false);
  }

  resetView(): void {
    const example = this.example();
    if (!example) {
      return;
    }
    this.yaw.set(example.defaultYaw);
    this.pitch.set(example.defaultPitch);
    this.horizontalFov.set(example.defaultHorizontalFov);
  }

  onExtractProgress(detail: { progress: number }): void {
    this.extractBusy.set(true);
    this.extractProgress.set(detail.progress);
  }

  onExtractComplete(detail: {
    blob: Blob;
    metadata: Record<string, string | number | boolean | null | undefined>;
  }): void {
    this.extractBusy.set(false);
    this.extractProgress.set(100);
    this.extractError.set(null);
    this.revokeExtractUrl();
    const url = URL.createObjectURL(detail.blob);
    this.extractObjectUrl = url;
    this.extractUrl.set(url);
    const filter = detail.metadata.filter;
    this.extractFilter.set(typeof filter === 'string' ? filter : '');
  }

  onExtractError(detail: { message: string }): void {
    this.extractBusy.set(false);
    this.extractError.set(detail.message);
  }

  private revokeExtractUrl(): void {
    if (this.extractObjectUrl) {
      URL.revokeObjectURL(this.extractObjectUrl);
      this.extractObjectUrl = null;
    }
    this.extractUrl.set(null);
  }
}
