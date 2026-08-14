import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface DateRangeFilterProps {
  label?: string;
  startDate?: string;
  endDate?: string;
  presetLabel?: string;
  onChange?: (range: { startDate: string; endDate: string }) => void;
  className?: string;
}

/** @rosettadash/angular/visual/input/date-range — visual.input.date-range */
@Component({
  selector: 'rd-input-date-range',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-input-date-range'" [ngClass]="rootClass()">
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      <div class="rd-date-range__controls">
        <input type="date" class="rd-input" [value]="startDate() ?? ''" />
        <span class="rd-date-range__sep">to</span>
        <input type="date" class="rd-input" [value]="endDate() ?? ''" />
      </div>
      @if (presetLabel()) { <span class="rd-date-range__preset">{{ presetLabel() }}</span> }
      <ng-content />
    </section>
  `,
})
export class DateRangeFilter {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly startDate = input<string | undefined>(undefined);
  readonly endDate = input<string | undefined>(undefined);
  readonly presetLabel = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-input-date-range', this.className()].filter(Boolean).join(' '),
  );
}
