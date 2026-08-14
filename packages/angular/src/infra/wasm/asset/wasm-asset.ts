import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface WasmAssetProps {
  assetPath?: string;
  gluePath?: string;
  className?: string;
}

/** @rosettadash/angular/infra/wasm/asset — infra.wasm.asset */
@Component({
  selector: 'rd-wasm-asset',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-wasm-asset'" [ngClass]="rootClass()">
      <span class="rd-wasm__badge">WASM</span>
      <code>{{ assetPath() ?? 'wasm/modules/example.wasm' }}</code>
      @if (gluePath()) { <span class="rd-wasm__glue">+ {{ gluePath() }}</span> }
      <ng-content />
    </section>
  `,
})
export class WasmAsset {
  readonly className = input<string | undefined>(undefined);
  readonly assetPath = input<string | undefined>(undefined);
  readonly gluePath = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-wasm-asset', this.className()].filter(Boolean).join(' '),
  );
}
