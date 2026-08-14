import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface MetricChipProps {
  chipLabel?: string;
  chipValue?: string;
  className?: string;
}

/** @rosettadash/angular/visual/plugin/metric-chip — visual.plugin.metric-chip */
@Component({
  selector: 'rd-plugin-metric-chip',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [attr.data-testid]="'rd-plugin-metric-chip'" [ngClass]="rootClass()">
      <span class="rd-plugin-metric-chip__label">{{ chipLabel() ?? 'Metric' }}</span>
      <span class="rd-plugin-metric-chip__value">{{ chipValue() ?? '—' }}</span>
    </span>
  `,
})
export class MetricChip {
  readonly className = input<string | undefined>(undefined);
  readonly chipLabel = input<string | undefined>(undefined);
  readonly chipValue = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-plugin-metric-chip', this.className()].filter(Boolean).join(' '),
  );
}
