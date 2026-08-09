import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { ComponentNode, parseRoleGateAllowedRoles, resolveRoleOptions, roleGateAllowsRole } from '@dashbuilder/core';
import { BuilderStateService } from '../builder-state.service';
import { PreviewDataService } from './preview-data.service';

@Component({
  selector: 'app-preview-node',
  imports: [CurrencyPipe, JsonPipe],
  templateUrl: './preview-node.component.html',
  styleUrl: './preview-node.component.scss',
})
export class PreviewNodeComponent {
  readonly node = input.required<ComponentNode>();

  private readonly previewData = inject(PreviewDataService);
  private readonly state = inject(BuilderStateService);

  private readonly slice = computed(() =>
    this.previewData.sliceForNode(this.node().id),
  );

  protected readonly tableRows = computed(
    () => this.slice()?.tableRows ?? this.previewData.bundle().tableRows,
  );
  protected readonly selectOptions = computed(
    () => this.previewData.bundle().selectOptions,
  );
  protected readonly chartPoints = computed(
    () => this.slice()?.chartPoints ?? this.previewData.bundle().chartPoints,
  );
  protected readonly kpiValue = computed(() => this.previewData.bundle().kpiValue);
  protected readonly kpiDelta = computed(() => this.previewData.bundle().kpiDelta);
  protected readonly dateRangeLabel = computed(
    () => this.slice()?.dateRangeLabel ?? this.previewData.bundle().dateRangeLabel,
  );
  protected readonly bindingHint = computed(() => {
    const slice = this.slice();
    if (slice?.filteredByDateRange && slice.linkedFromTable) {
      return 'Date range → table → chart';
    }
    if (slice?.filteredByDateRange) {
      return 'Filtered by date range';
    }
    if (slice?.linkedFromTable) {
      return 'Chart uses table rowset';
    }
    return null;
  });

  protected readonly chartMax = computed(() =>
    Math.max(...this.chartPoints().map((point) => point.value), 1),
  );

  protected readonly lineChartPoints = computed(() => {
    const points = this.chartPoints();
    const max = this.chartMax();
    if (points.length < 2) {
      return '';
    }
    return points
      .map((point, index) => {
        const x = index * (220 / (points.length - 1)) + 10;
        const y = 86 - (point.value / max) * 72;
        return `${x},${y}`;
      })
      .join(' ');
  });

  protected readonly roleGateAllowedRoles = computed(() =>
    parseRoleGateAllowedRoles(this.node().properties['roles']),
  );

  protected readonly roleGateVisible = computed(() => {
    if (this.node().type !== 'domain.role-gate') {
      return true;
    }
    return roleGateAllowsRole(this.roleGateAllowedRoles(), this.state.previewRoleId());
  });

  protected readonly roleAssignOptions = computed(() =>
    resolveRoleOptions(this.state.domainContext()?.roles),
  );

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
