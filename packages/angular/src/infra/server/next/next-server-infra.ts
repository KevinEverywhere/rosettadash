import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface NextServerInfraProps {
  label?: string;
  globalPrefix?: string;
  className?: string;
}

/** @rosettadash/angular/infra/server/next — infra.server.next */
@Component({
  selector: 'rd-server-next',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-server-next'" [ngClass]="rootClass()">
      <span class="rd-infra__badge">INFRA</span>
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      @if (globalPrefix()) { <code>globalPrefix: {{ globalPrefix() }}</code> }
      <ng-content />
    </section>
  `,
})
export class NextServerInfra {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly globalPrefix = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-server-next', this.className()].filter(Boolean).join(' '),
  );
}
