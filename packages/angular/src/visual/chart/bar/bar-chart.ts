import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface BarChartProps {
  title?: string;
  className?: string;
}

/** @rosettadash/angular/visual/chart/bar — visual.chart.bar */
@Component({
  selector: 'rd-chart-bar',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-chart-bar'" [ngClass]="rootClass()">
      <header class="rd-chart-bar__header"><span>{{ title() ?? 'Bar chart' }}</span></header>
      <div class="rd-chart-bar__bars" aria-hidden="true">
        @for (h of barHeights; track $index) {
          <div class="rd-chart-bar__bar-wrap"><div class="rd-chart-bar__bar" [style.height.%]="h"></div></div>
        }
      </div>
      <ng-content />
    </section>
  `,
})
export class BarChart {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-chart-bar', this.className()].filter(Boolean).join(' '),
  );
  readonly barHeights = [40, 65, 55, 80, 48];
}
