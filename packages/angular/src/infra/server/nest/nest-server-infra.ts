import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface NestServerInfraProps {
  label?: string;
  globalPrefix?: string;
  className?: string;
}

/** @rosettadash/angular/infra/server/nest — infra.server.nest */
@Component({
  selector: 'rd-server-nest',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-server-nest'" [ngClass]="rootClass()">
      <span class="rd-infra__badge">INFRA</span>
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      @if (globalPrefix()) { <code>globalPrefix: {{ globalPrefix() }}</code> }
      <ng-content />
    </section>
  `,
})
export class NestServerInfra {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly globalPrefix = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-server-nest', this.className()].filter(Boolean).join(' '),
  );
}
