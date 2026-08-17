import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { clampCropToSource, type FlatCropRect } from '@rosettadash/core';

export type FlatVideoCropChange = FlatCropRect;

export interface FlatVideoViewportHandle {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  isPaused: () => boolean;
  getOutputCanvas: () => HTMLCanvasElement | null;
  startRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
}

type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se';

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

function pickRecorderMimeType(): string {
  const candidates = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'video/webm';
}

function previewCanvasSize(cropWidth: number, cropHeight: number, maxEdge = 720) {
  const safeCropWidth = Math.max(2, Math.round(cropWidth));
  const safeCropHeight = Math.max(2, Math.round(cropHeight));
  const scale = Math.min(1, maxEdge / Math.max(safeCropWidth, safeCropHeight));
  return {
    width: Math.max(2, Math.round((safeCropWidth * scale) / 2) * 2),
    height: Math.max(2, Math.round((safeCropHeight * scale) / 2) * 2),
  };
}

function fitCropSizeInHost(
  cropWidth: number,
  cropHeight: number,
  hostWidth: number,
  hostHeight: number,
  dpr = 1,
) {
  const cropW = Math.max(2, Math.round(cropWidth));
  const cropH = Math.max(2, Math.round(cropHeight));
  const cropAspect = cropW / cropH;
  const hostAspect = hostWidth / hostHeight;

  let fitWidth: number;
  let fitHeight: number;
  if (cropAspect > hostAspect) {
    fitWidth = hostWidth;
    fitHeight = hostWidth / cropAspect;
  } else {
    fitHeight = hostHeight;
    fitWidth = hostHeight * cropAspect;
  }

  return {
    width: Math.max(2, Math.round((fitWidth * dpr) / 2) * 2),
    height: Math.max(2, Math.round((fitHeight * dpr) / 2) * 2),
  };
}

function applyPreviewCanvasLayout(
  canvas: HTMLCanvasElement,
  cropWidth: number,
  cropHeight: number,
  host?: HTMLElement | null,
) {
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
  const rect = host?.getBoundingClientRect();
  const { width, height } =
    rect && rect.width > 0 && rect.height > 0
      ? fitCropSizeInHost(cropWidth, cropHeight, rect.width, rect.height, dpr)
      : previewCanvasSize(cropWidth, cropHeight);

  canvas.width = width;
  canvas.height = height;
  canvas.style.removeProperty('width');
  canvas.style.removeProperty('height');
  canvas.style.removeProperty('max-width');
  canvas.style.removeProperty('max-height');
  canvas.style.removeProperty('aspect-ratio');
}

function drawFlatCropPreview(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
  canvasWidth: number,
  canvasHeight: number,
) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, canvasWidth, canvasHeight);
}

@Component({
  selector: 'rd-flat-video-viewport',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #host [attr.data-testid]="'rd-flat-video-viewport'" [ngClass]="rootClass()">
      <div #frame class="rd-flat-video-viewport__frame" [style.aspect-ratio]="frameAspect()">
        <video #video class="rd-flat-video-viewport__video" muted playsinline crossorigin="anonymous"></video>
        <div
          class="rd-flat-video-viewport__crop"
          [style.left.%]="cropLeftPct()"
          [style.top.%]="cropTopPct()"
          [style.width.%]="cropWidthPct()"
          [style.height.%]="cropHeightPct()"
          (pointerdown)="onPointerDown($event, 'move')"
        >
          @for (handle of handles; track handle) {
            <span
              [class]="'rd-flat-video-viewport__handle rd-flat-video-viewport__handle--' + handle"
              (pointerdown)="onPointerDown($event, handle)"
            ></span>
          }
        </div>
      </div>
    </div>
  `,
})
export class FlatVideoViewport implements AfterViewInit, OnDestroy {
  readonly videoSrc = input<string | null>(null);
  readonly sourceWidth = input.required<number>();
  readonly sourceHeight = input.required<number>();
  readonly cropX = input.required<number>();
  readonly cropY = input.required<number>();
  readonly cropWidth = input.required<number>();
  readonly cropHeight = input.required<number>();
  readonly outputWidth = input(640);
  readonly outputHeight = input(360);
  readonly lockAspectRatio = input(false);
  readonly className = input('');
  readonly outputPreviewElement = input<HTMLElement | null>(null);
  readonly cropChange = output<FlatVideoCropChange>();

  readonly hostRef = viewChild<ElementRef<HTMLElement>>('host');
  readonly frameRef = viewChild<ElementRef<HTMLElement>>('frame');
  readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('video');

  readonly handles: DragMode[] = ['nw', 'ne', 'sw', 'se'];

  private outputCanvas: HTMLCanvasElement | null = null;
  private outputPreviewHost: HTMLElement | null = null;
  private outputMirrorResizeObserver: ResizeObserver | null = null;
  private animationId = 0;
  private disposeMirror: (() => void) | null = null;
  private drag: {
    mode: DragMode;
    startX: number;
    startY: number;
    origin: FlatCropRect;
  } | null = null;
  private recorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  readonly rootClass = () => ['rd-flat-video-viewport', this.className()].filter(Boolean).join(' ');
  readonly frameAspect = () => `${this.sourceWidth()} / ${this.sourceHeight()}`;
  readonly cropLeftPct = () => (this.cropX() / this.sourceWidth()) * 100;
  readonly cropTopPct = () => (this.cropY() / this.sourceHeight()) * 100;
  readonly cropWidthPct = () => (this.cropWidth() / this.sourceWidth()) * 100;
  readonly cropHeightPct = () => (this.cropHeight() / this.sourceHeight()) * 100;

  private video: HTMLVideoElement | null = null;

  constructor() {
    effect(() => {
      const src = this.videoSrc();
      const video = this.videoRef()?.nativeElement ?? null;
      this.video = video;
      if (!video || !src) {
        return;
      }
      video.src = src;
      video.load();
      void video.play().catch(() => undefined);
    });

    effect(() => {
      this.cropWidth();
      this.cropHeight();
      this.resizeOutputCanvas();
    });

    effect(() => {
      this.outputPreviewElement();
      this.ensureOutputMirror();
    });
  }

  private ensureOutputMirror(): void {
    const host = this.outputPreviewElement();
    if (!host || this.outputCanvas?.isConnected) {
      return;
    }
    this.disposeMirror?.();
    this.mountOutputMirror(host);
  }

  ngAfterViewInit(): void {
    this.ensureOutputMirror();
  }

  ngOnDestroy(): void {
    this.disposeMirror?.();
    cancelAnimationFrame(this.animationId);
  }

  async play(): Promise<void> {
    if (!this.video) {
      return;
    }
    await this.video.play();
  }

  pause(): void {
    this.video?.pause();
  }

  stop(): void {
    if (!this.video) {
      return;
    }
    this.video.pause();
    this.video.currentTime = 0;
  }

  seek(time: number): void {
    if (!this.video) {
      return;
    }
    this.video.currentTime = clamp(time, 0, this.video.duration || time);
  }

  getCurrentTime(): number {
    return this.video?.currentTime ?? 0;
  }

  getDuration(): number {
    return this.video?.duration ?? 0;
  }

  isPaused(): boolean {
    return this.video?.paused ?? true;
  }

  getOutputCanvas(): HTMLCanvasElement | null {
    return this.outputCanvas;
  }

  startRecording(): void {
    const canvas = this.outputCanvas;
    if (!canvas || this.recorder) {
      return;
    }
    const stream = canvas.captureStream(30);
    this.recordedChunks = [];
    this.recorder = new MediaRecorder(stream, { mimeType: pickRecorderMimeType() });
    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };
    this.recorder.start(200);
  }

  stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const recorder = this.recorder;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: recorder.mimeType || 'video/webm' });
        this.recorder = null;
        this.recordedChunks = [];
        resolve(blob);
      };
      recorder.stop();
    });
  }

  onPointerDown(event: PointerEvent, mode: DragMode): void {
    const frame = this.frameRef()?.nativeElement;
    if (!frame || event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const pointer = this.pointerToSource(event.clientX, event.clientY, frame);
    this.drag = {
      mode,
      startX: pointer.x,
      startY: pointer.y,
      origin: {
        cropX: this.cropX(),
        cropY: this.cropY(),
        cropWidth: this.cropWidth(),
        cropHeight: this.cropHeight(),
      },
    };

    const onWindowMove = (moveEvent: PointerEvent) => {
      this.applyDrag(moveEvent.clientX, moveEvent.clientY);
    };
    const onWindowUp = () => {
      this.drag = null;
      window.removeEventListener('pointermove', onWindowMove);
      window.removeEventListener('pointerup', onWindowUp);
      window.removeEventListener('pointercancel', onWindowUp);
    };
    window.addEventListener('pointermove', onWindowMove);
    window.addEventListener('pointerup', onWindowUp);
    window.addEventListener('pointercancel', onWindowUp);
  }

  private pointerToSource(clientX: number, clientY: number, frame: HTMLElement) {
    const rect = frame.getBoundingClientRect();
    const sw = this.sourceWidth();
    const sh = this.sourceHeight();
    return {
      x: clamp(((clientX - rect.left) / rect.width) * sw, 0, sw),
      y: clamp(((clientY - rect.top) / rect.height) * sh, 0, sh),
    };
  }

  private emitCrop(next: FlatCropRect): void {
    this.cropChange.emit(clampCropToSource(next, this.sourceWidth(), this.sourceHeight()));
  }

  private applyDrag(clientX: number, clientY: number): void {
    const drag = this.drag;
    const frame = this.frameRef()?.nativeElement;
    if (!drag || !frame) {
      return;
    }
    const pointer = this.pointerToSource(clientX, clientY, frame);
    const dx = pointer.x - drag.startX;
    const dy = pointer.y - drag.startY;
    const origin = drag.origin;
    const outputAspect = this.outputWidth() / this.outputHeight();

    if (drag.mode === 'move') {
      this.emitCrop({
        cropX: origin.cropX + dx,
        cropY: origin.cropY + dy,
        cropWidth: origin.cropWidth,
        cropHeight: origin.cropHeight,
      });
      return;
    }

    let nextX = origin.cropX;
    let nextY = origin.cropY;
    let nextW = origin.cropWidth;
    let nextH = origin.cropHeight;

    if (drag.mode.includes('e')) {
      nextW = origin.cropWidth + dx;
    }
    if (drag.mode.includes('w')) {
      nextW = origin.cropWidth - dx;
      nextX = origin.cropX + dx;
    }
    if (drag.mode.includes('s')) {
      nextH = origin.cropHeight + dy;
    }
    if (drag.mode.includes('n')) {
      nextH = origin.cropHeight - dy;
      nextY = origin.cropY + dy;
    }

    if (this.lockAspectRatio() && outputAspect > 0) {
      nextH = nextW / outputAspect;
      if (drag.mode.includes('n')) {
        nextY = origin.cropY + origin.cropHeight - nextH;
      }
      if (drag.mode.includes('w')) {
        nextX = origin.cropX + origin.cropWidth - nextW;
      }
    }

    this.emitCrop({
      cropX: nextX,
      cropY: nextY,
      cropWidth: Math.max(2, nextW),
      cropHeight: Math.max(2, nextH),
    });
  }

  private mountOutputMirror(host: HTMLElement): void {
    const canvas = document.createElement('canvas');
    canvas.className = 'rd-flat-video-viewport__mirror';
    canvas.setAttribute('aria-label', 'Output view (cropped region)');
    host.appendChild(canvas);
    this.outputCanvas = canvas;
    this.outputPreviewHost = host;
    this.resizeOutputCanvas();

    const tick = () => {
      const video = this.videoRef()?.nativeElement;
      const ctx = canvas.getContext('2d');
      if (video && ctx && video.readyState >= 2) {
        drawFlatCropPreview(
          ctx,
          video,
          this.cropX(),
          this.cropY(),
          this.cropWidth(),
          this.cropHeight(),
          canvas.width,
          canvas.height,
        );
      }
      this.animationId = requestAnimationFrame(tick);
    };
    tick();

    this.outputMirrorResizeObserver = new ResizeObserver(() => this.resizeOutputCanvas());
    this.outputMirrorResizeObserver.observe(host);

    this.disposeMirror = () => {
      this.outputMirrorResizeObserver?.disconnect();
      this.outputMirrorResizeObserver = null;
      cancelAnimationFrame(this.animationId);
      canvas.remove();
      this.outputCanvas = null;
      this.outputPreviewHost = null;
    };
  }

  private resizeOutputCanvas(): void {
    const canvas = this.outputCanvas;
    if (!canvas) {
      return;
    }
    applyPreviewCanvasLayout(canvas, this.cropWidth(), this.cropHeight(), this.outputPreviewHost);
  }
}
