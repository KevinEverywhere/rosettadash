import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface FilterSummaryChip {
  label: string;
  value: string;
}

@Component({
  selector: 'da-filter-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rd-filter-summary" data-testid="rd-filter-summary" aria-live="polite">
      <div class="rd-filter-summary__header">
        <strong>{{ summaryTitle() }}</strong>
        <span class="rd-filter-summary__count">{{ count() }} {{ countLabel() }}</span>
      </div>
      <dl class="rd-filter-summary__chips">
        @for (chip of chips(); track chip.label) {
          <div>
            <dt>{{ chip.label }}</dt>
            <dd>{{ chip.value }}</dd>
          </div>
        }
      </dl>
      @if (hint()) {
        <p class="rd-filter-summary__hint">{{ hint() }}</p>
      }
    </section>
  `,
})
export class FilterSummaryComponent {
  readonly summaryTitle = input('Filter results');
  readonly count = input(0);
  readonly countNoun = input('result');
  readonly chips = input<FilterSummaryChip[]>([]);
  readonly hint = input<string>();

  countLabel(): string {
    const noun = this.countNoun();
    return this.count() === 1 ? noun : `${noun}s`;
  }
}

@Component({
  selector: 'da-time-preset-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rd-time-preset">
      @if (fieldLabel()) {
        <span class="rd-field__label">{{ fieldLabel() }}</span>
      }
      <div class="rd-time-preset__buttons" role="group">
        @for (preset of presets(); track preset.id) {
          <button
            type="button"
            class="rd-time-preset__button"
            [class.rd-time-preset__button--active]="activePresetId() === preset.id"
            (click)="presetChange.emit(preset.id)"
          >
            {{ preset.label }}
          </button>
        }
      </div>
    </section>
  `,
})
export class TimePresetButtonsComponent {
  readonly fieldLabel = input<string>();
  readonly presets = input<Array<{ id: string; label: string }>>([]);
  readonly activePresetId = input('5y');
  readonly presetChange = output<string>();
}
