import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ComponentNode } from '@dashbuilder/core';
import {
  PREVIEW_CHART_POINTS,
  PREVIEW_DATE_RANGE_LABEL,
  PREVIEW_KPI_DELTA,
  PREVIEW_KPI_VALUE,
  PREVIEW_SELECT_OPTIONS,
  PREVIEW_TABLE_ROWS,
} from '@dashbuilder/ui-primitives';

@Component({
  selector: 'app-preview-node',
  imports: [CurrencyPipe, JsonPipe],
  templateUrl: './preview-node.component.html',
  styleUrl: './preview-node.component.scss',
})
export class PreviewNodeComponent {
  readonly node = input.required<ComponentNode>();

  protected readonly tableRows = PREVIEW_TABLE_ROWS;
  protected readonly selectOptions = PREVIEW_SELECT_OPTIONS;
  protected readonly chartPoints = PREVIEW_CHART_POINTS;
  protected readonly kpiValue = PREVIEW_KPI_VALUE;
  protected readonly kpiDelta = PREVIEW_KPI_DELTA;
  protected readonly dateRangeLabel = PREVIEW_DATE_RANGE_LABEL;

  protected readonly chartMax = computed(() =>
    Math.max(...this.chartPoints.map((point) => point.value), 1),
  );

  protected readonly lineChartPoints = computed(() => {
    const max = this.chartMax();
    if (this.chartPoints.length < 2) {
      return '';
    }
    return this.chartPoints
      .map((point, index) => {
        const x = index * (220 / (this.chartPoints.length - 1)) + 10;
        const y = 86 - (point.value / max) * 72;
        return `${x},${y}`;
      })
      .join(' ');
  });

  protected readString(key: string, fallback = ''): string {
    const value = this.node().properties[key];
    return typeof value === 'string' ? value : fallback;
  }

  protected readNumber(key: string, fallback: number): number {
    const value = this.node().properties[key];
    return typeof value === 'number' ? value : fallback;
  }

  protected readBoolean(key: string, fallback = false): boolean {
    const value = this.node().properties[key];
    return typeof value === 'boolean' ? value : fallback;
  }

  protected formatKpi(value: number): string {
    const format = this.readString('format', 'number');
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value);
    }
    if (format === 'percent') {
      return `${value}%`;
    }
    return new Intl.NumberFormat('en-US').format(value);
  }
}
