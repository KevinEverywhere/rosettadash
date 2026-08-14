import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface WasmWorkerHostProps {
  workerLabel?: string;
  workerStatus?: string;
  className?: string;
}

/** @rosettadash/angular/visual/wasm/worker-host — visual.wasm.worker-host */
@Component({
  selector: 'rd-wasm-worker-host',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-wasm-worker-host'" [ngClass]="rootClass()">
      <span class="rd-wasm__label">{{ workerLabel() ?? 'Worker' }}</span>
      <span class="rd-wasm__status">{{ workerStatus() ?? 'Idle' }}</span>
      <ng-content />
    </section>
  `,
})
export class WasmWorkerHost {
  readonly className = input<string | undefined>(undefined);
  readonly workerLabel = input<string | undefined>(undefined);
  readonly workerStatus = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-wasm-worker-host', this.className()].filter(Boolean).join(' '),
  );
}
