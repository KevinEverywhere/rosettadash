import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface WasmModuleProps {
  moduleLabel?: string;
  exportName?: string;
  className?: string;
}

/** @rosettadash/angular/visual/wasm/module — visual.wasm.module */
@Component({
  selector: 'rd-wasm-module',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-wasm-module'" [ngClass]="rootClass()">
      <span class="rd-wasm__label">{{ moduleLabel() ?? 'WASM Module' }}</span>
      <code>{{ exportFn() ?? 'run()' }}()</code>
      <ng-content />
    </section>
  `,
})
export class WasmModule {
  readonly className = input<string | undefined>(undefined);
  readonly moduleLabel = input<string | undefined>(undefined);
  readonly exportName = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-wasm-module', this.className()].filter(Boolean).join(' '),
  );
  exportFn(): string | undefined {
    return this.exportName();
  }
}
