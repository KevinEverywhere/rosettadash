import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

/** Minimal playback API used by the authoring bar (matches EquirectSphereViewport). */
export interface AuthoringViewportHandle {
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  seek(time: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  isPaused(): boolean;
  startRecording(): void;
  stopRecording(): Promise<Blob | null>;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

@Component({
  selector: 'da-authoring-playback-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="da-authoring-playback" aria-label="Source playback and recording">
      <h4 class="da-authoring-playback__title">Playback</h4>
      <div class="da-authoring-playback__transport">
        <button type="button" class="da-authoring-playback__btn" [disabled]="disabled()" (click)="togglePlayPause()">
          {{ paused() ? 'Play' : 'Pause' }}
        </button>
        <button type="button" class="da-authoring-playback__btn" [disabled]="disabled()" (click)="stop()">Stop</button>
        <button
          type="button"
          class="da-authoring-playback__btn"
          [class.is-active]="recording()"
          [disabled]="disabled()"
          (click)="toggleRecord()"
        >
          {{ recording() ? 'Stop recording' : 'Record' }}
        </button>
        <button type="button" class="da-authoring-playback__btn" [disabled]="disabled() || !saveUrl()" (click)="save()">
          Save
        </button>
        <button type="button" class="da-authoring-playback__btn" [disabled]="disabled()" (click)="resetView.emit()">
          Reset view
        </button>
      </div>
      <label class="da-authoring-playback__scrub">
        <span class="da-authoring-playback__time">{{ formatTime(currentTime()) }}</span>
        <input
          type="range"
          min="0"
          [max]="duration() > 0 ? duration() : 0"
          step="0.05"
          [value]="scrubValue()"
          [disabled]="disabled() || duration() <= 0"
          (input)="seek($any($event.target).value)"
        />
        <span class="da-authoring-playback__time">{{ formatTime(duration()) }}</span>
      </label>
      <p class="da-note da-authoring-playback__hint">
        Drag on the sphere or use Camera framing sliders · FOV above 130° enters little-planet
      </p>
    </div>
  `,
})
export class AuthoringPlaybackBarComponent {
  readonly viewport = input<AuthoringViewportHandle | null>(null);
  readonly disabled = input(false);

  readonly resetView = output<void>();

  readonly formatTime = formatTime;
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly paused = signal(true);
  readonly recording = signal(false);
  readonly saveUrl = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const id = window.setInterval(() => this.syncFromViewport(), 250);
      onCleanup(() => window.clearInterval(id));
    });
  }

  scrubValue(): number {
    return Math.min(this.currentTime(), this.duration() || 0);
  }

  private syncFromViewport(): void {
    const viewport = this.viewport();
    if (!viewport) {
      return;
    }
    this.currentTime.set(viewport.getCurrentTime());
    this.duration.set(viewport.getDuration());
    this.paused.set(viewport.isPaused());
  }

  async togglePlayPause(): Promise<void> {
    const viewport = this.viewport();
    if (!viewport || this.disabled()) {
      return;
    }
    if (viewport.isPaused()) {
      await viewport.play();
    } else {
      viewport.pause();
    }
    this.syncFromViewport();
  }

  stop(): void {
    this.viewport()?.stop();
    this.syncFromViewport();
  }

  seek(value: string): void {
    this.viewport()?.seek(Number(value));
    this.currentTime.set(Number(value));
  }

  async toggleRecord(): Promise<void> {
    const viewport = this.viewport();
    if (!viewport || this.disabled()) {
      return;
    }
    if (!this.recording()) {
      viewport.startRecording();
      this.recording.set(true);
      if (viewport.isPaused()) {
        await viewport.play();
      }
      return;
    }
    const blob = await viewport.stopRecording();
    this.recording.set(false);
    if (!blob) {
      return;
    }
    const previous = this.saveUrl();
    if (previous) {
      URL.revokeObjectURL(previous);
    }
    this.saveUrl.set(URL.createObjectURL(blob));
  }

  save(): void {
    const url = this.saveUrl();
    if (!url) {
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `authoring-recording-${Date.now()}.webm`;
    anchor.click();
  }
}
