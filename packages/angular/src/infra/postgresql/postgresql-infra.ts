import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface PostgresqlInfraProps {
  label?: string;
  envKey?: string;
  tableOrCollection?: string;
  className?: string;
}

/** @rosettadash/angular/infra/postgresql — infra.postgresql */
@Component({
  selector: 'rd-postgresql',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-postgresql'" [ngClass]="rootClass()">
      <span class="rd-infra__badge">INFRA</span>
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      @if (envKey()) { <code>{{ envKey() }}</code> }
      @if (tableOrCollection()) { <span class="rd-infra__meta">{{ tableOrCollection() }}</span> }
      <ng-content />
    </section>
  `,
})
export class PostgresqlInfra {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly envKey = input<string | undefined>(undefined);
  readonly tableOrCollection = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-postgresql', this.className()].filter(Boolean).join(' '),
  );
}
