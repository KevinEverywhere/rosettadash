import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface TimerProps {
  label?: string;
  mode?: 'interval' | 'countdown';
  intervalMs?: number;
  tickCount?: number;
  className?: string;
}

/** @rosettadash/angular/logic/timer — logic.timer */
@Component({
  selector: 'rd-timer',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-timer'" [ngClass]="rootClass()">
      @if (label()) { <span class="rd-timer__label">{{ label() }}</span> }
      <span class="rd-timer__value">{{ tickCount() ?? 0 }} ticks</span>
      <ng-content />
    </section>
  `,
})
export class Timer {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly mode = input<'interval' | 'countdown' | undefined>(undefined);
  readonly intervalMs = input<number | undefined>(undefined);
  readonly tickCount = input<number | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-timer', this.className()].filter(Boolean).join(' '),
  );
}
