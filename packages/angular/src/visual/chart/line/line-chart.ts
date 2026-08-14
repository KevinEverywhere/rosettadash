import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface LineChartProps {
  title?: string;
  className?: string;
}

/** @rosettadash/angular/visual/chart/line — visual.chart.line */
@Component({
  selector: 'rd-chart-line',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-chart-line'" [ngClass]="rootClass()">
      <header class="rd-chart-line__header"><span>{{ title() ?? 'Line chart' }}</span></header>
      <svg viewBox="0 0 240 96" class="rd-chart-line__svg" aria-hidden="true">
        <polyline class="rd-chart-line__line" points="0,80 40,60 80,65 120,40 160,45 200,20 240,30" />
      </svg>
      <ng-content />
    </section>
  `,
})
export class LineChart {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-chart-line', this.className()].filter(Boolean).join(' '),
  );
}
