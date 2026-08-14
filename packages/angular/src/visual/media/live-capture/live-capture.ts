import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface LiveCaptureProps {
  label?: string;
  onStart?: () => void;
  className?: string;
}

/** @rosettadash/angular/visual/media/live-capture — visual.media.live-capture */
@Component({
  selector: 'rd-media-live-capture',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-media-live-capture'" [ngClass]="rootClass()">
      <span class="rd-media__label">{{ label() ?? 'Live capture' }}</span>
      <button type="button" class="rd-button">Start camera</button>
      <ng-content />
    </section>
  `,
})
export class LiveCapture {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-media-live-capture', this.className()].filter(Boolean).join(' '),
  );
}
