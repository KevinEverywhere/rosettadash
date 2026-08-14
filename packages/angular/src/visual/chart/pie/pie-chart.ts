import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface PieChartProps {
  title?: string;
  className?: string;
}

/** @rosettadash/angular/visual/chart/pie — visual.chart.pie */
@Component({
  selector: 'rd-chart-pie',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-chart-pie'" [ngClass]="rootClass()">
      <header class="rd-chart-pie__header"><span>{{ title() ?? 'Pie chart' }}</span></header>
      <div class="rd-chart-pie__pie" aria-hidden="true"></div>
      <ng-content />
    </section>
  `,
})
export class PieChart {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-chart-pie', this.className()].filter(Boolean).join(' '),
  );
}
