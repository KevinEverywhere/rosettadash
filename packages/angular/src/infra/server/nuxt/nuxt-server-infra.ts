import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface NuxtServerInfraProps {
  label?: string;
  globalPrefix?: string;
  className?: string;
}

/** @rosettadash/angular/infra/server/nuxt — infra.server.nuxt */
@Component({
  selector: 'rd-server-nuxt',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-server-nuxt'" [ngClass]="rootClass()">
      <span class="rd-infra__badge">INFRA</span>
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      @if (globalPrefix()) { <code>globalPrefix: {{ globalPrefix() }}</code> }
      <ng-content />
    </section>
  `,
})
export class NuxtServerInfra {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly globalPrefix = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-server-nuxt', this.className()].filter(Boolean).join(' '),
  );
}
