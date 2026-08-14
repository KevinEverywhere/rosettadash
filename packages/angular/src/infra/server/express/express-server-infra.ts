import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ExpressServerInfraProps {
  label?: string;
  globalPrefix?: string;
  className?: string;
}

/** @rosettadash/angular/infra/server/express — infra.server.express */
@Component({
  selector: 'rd-server-express',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-server-express'" [ngClass]="rootClass()">
      <span class="rd-infra__badge">INFRA</span>
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      @if (globalPrefix()) { <code>globalPrefix: {{ globalPrefix() }}</code> }
      <ng-content />
    </section>
  `,
})
export class ExpressServerInfra {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly globalPrefix = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-server-express', this.className()].filter(Boolean).join(' '),
  );
}
