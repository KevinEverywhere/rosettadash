import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface KpiCardProps {
  title?: string;
  value?: string | number;
  delta?: string;
  format?: 'number' | 'currency' | 'percent';
  className?: string;
}

/** @rosettadash/angular/visual/kpi — visual.kpi */
@Component({
  selector: 'rd-kpi',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article [attr.data-testid]="'rd-kpi'" [ngClass]="rootClass()">
      <span class="rd-kpi__title">{{ title() ?? 'Metric' }}</span>
      <span class="rd-kpi__value">{{ value() ?? '—' }}</span>
      @if (delta()) { <span class="rd-kpi__delta">{{ delta() }}</span> }
      <ng-content />
    </article>
  `,
})
export class KpiCard {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly value = input<string | number | undefined>(undefined);
  readonly delta = input<string | undefined>(undefined);
  readonly format = input<'number' | 'currency' | 'percent' | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-kpi', this.className()].filter(Boolean).join(' '),
  );
}
