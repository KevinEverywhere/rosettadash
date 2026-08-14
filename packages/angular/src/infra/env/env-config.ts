import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface EnvConfigProps {
  envKeys?: string;
  className?: string;
}

/** @rosettadash/angular/infra/env — infra.env */
@Component({
  selector: 'rd-env',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-env'" [ngClass]="rootClass()">
      <span class="rd-infra__badge">INFRA</span>
      <span class="rd-field__label">Environment config</span>
      <code>{{ envKeys() ?? 'DATABASE_URL, API_KEY' }}</code>
      <ng-content />
    </section>
  `,
})
export class EnvConfig {
  readonly className = input<string | undefined>(undefined);
  readonly envKeys = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-env', this.className()].filter(Boolean).join(' '),
  );
}
