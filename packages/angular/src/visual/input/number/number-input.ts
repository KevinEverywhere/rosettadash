import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface NumberInputProps {
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

/** @rosettadash/angular/visual/input/number — visual.input.number */
@Component({
  selector: 'rd-input-number',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-input-number'" [ngClass]="rootClass()">
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      <input type="number" class="rd-input" [placeholder]="placeholder() ?? ''" [min]="min()" [max]="max()" [step]="step()" [value]="value()" />
      <ng-content />
    </section>
  `,
})
export class NumberInput {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly min = input<number | undefined>(undefined);
  readonly max = input<number | undefined>(undefined);
  readonly step = input<number | undefined>(undefined);
  readonly value = input<number | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-input-number', this.className()].filter(Boolean).join(' '),
  );
}
