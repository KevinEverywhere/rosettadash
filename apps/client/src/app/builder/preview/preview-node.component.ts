import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { ComponentNode, parseRoleGateAllowedRoles, resolveRoleOptions, roleGateAllowsRole } from '@dashbuilder/core';
import { PreviewRow, PRESET_LABELS } from '@dashbuilder/ui-primitives';
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

  constructor() {
    effect((onCleanup) => {
      const node = this.node();
      if (node.type !== 'logic.timer') {
        return;
      }

      this.timerElapsed.set(0);
      if (!this.readBoolean('autoStart', true)) {
        this.timerRemaining.set(0);
        return;
      }

      const mode = this.readString('mode', 'interval');
      const previewStepMs = 1000;

      if (mode === 'countdown') {
        const totalSeconds = Math.max(1, Math.ceil(this.readNumber('durationMs', 30000) / 1000));
        this.timerRemaining.set(totalSeconds);
        const id = window.setInterval(() => {
          this.timerElapsed.update((value) => value + 1);
          this.timerRemaining.update((value) => Math.max(0, value - 1));
        }, previewStepMs);
        onCleanup(() => window.clearInterval(id));
        return;
      }

      const id = window.setInterval(() => {
        this.timerElapsed.update((value) => value + 1);
      }, previewStepMs);
      onCleanup(() => window.clearInterval(id));
    });
  }

  private readonly slice = computed(() =>
    this.previewData.sliceForNode(this.node().id),
  );

  protected readonly linkedToTable = computed(() => this.slice()?.linkedToTable ?? false);

  protected readonly skeletonVisible = computed(() => {
    const slice = this.slice();
    if (slice?.skeletonLoading !== undefined) {
      return slice.skeletonLoading;
    }
    if (slice?.linkedToData) {
      return this.previewData.loading();
    }
    return this.readBoolean('defaultLoading', true);
  });

  protected readonly skeletonVariant = computed(
    () => this.slice()?.skeletonVariant ?? this.readString('variant', 'table'),
  );

  protected readonly skeletonLines = computed(() => {
    const lines = this.slice()?.skeletonLines ?? this.readNumber('lines', 4);
    const count = Math.max(1, Math.min(lines, 8));
    return Array.from({ length: count }, (_, index) => index);
  });

  protected readonly timerElapsed = signal(0);
  protected readonly timerRemaining = signal(0);

  protected readonly timePresetOptions = [
    { id: 'last-7-days', label: PRESET_LABELS['last-7-days'] },
    { id: 'last-30-days', label: PRESET_LABELS['last-30-days'] },
    { id: 'qtd', label: PRESET_LABELS['qtd'] },
  ];

  protected readonly activeTimePreset = computed(
    () =>
      this.previewData.selectedTimePreset() ??
      this.slice()?.activeTimePreset ??
      this.readString('defaultPreset', 'last-7-days'),
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

  protected readonly pieSlices = computed(() => {
    const points = this.chartPoints();
    const total = points.reduce((sum, point) => sum + point.value, 0) || 1;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    let cumulative = 0;

    return points.map((point, index) => {
      const percent = (point.value / total) * 100;
      const slice = {
        label: point.label,
        percent,
        start: cumulative,
        color: colors[index % colors.length] ?? colors[0],
      };
      cumulative += percent;
      return slice;
    });
  });

  protected readonly pieConicGradient = computed(() => {
    const slices = this.pieSlices();
    if (slices.length === 0) {
      return 'conic-gradient(#d1d5db 0 100%)';
    }
    const stops = slices
      .map((slice) => `${slice.color} ${slice.start}% ${slice.start + slice.percent}%`)
      .join(', ');
    return `conic-gradient(${stops})`;
  });

  protected readonly detailRow = computed(() => {
    const selected = this.previewData.selectedTableRow();
    if (selected) {
      return selected;
    }
    return this.slice()?.selectedRow ?? null;
  });

  protected readonly detailFields = computed(() => {
    const row = this.detailRow();
    if (!row) {
      return [] as Array<{ key: string; value: string }>;
    }
    return Object.entries(row).map(([key, value]) => ({
      key,
      value: String(value ?? ''),
    }));
  });

  protected selectTableRow(row: PreviewRow): void {
    this.previewData.selectTableRow(row);
  }

  protected selectTimePreset(preset: string): void {
    this.previewData.selectTimePreset(preset);
  }

  protected isActiveTimePreset(preset: string): boolean {
    return this.activeTimePreset() === preset;
  }

  protected isSelectedTableRow(row: PreviewRow): boolean {
    const selected = this.detailRow();
    return !!selected && selected.id === row.id;
  }

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
