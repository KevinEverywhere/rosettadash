import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface TextInputProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/** @rosettadash/angular/visual/input/text — visual.input.text */
@Component({
  selector: 'rd-input-text',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-input-text'" [ngClass]="rootClass()">
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      <input type="text" class="rd-input" [placeholder]="placeholder() ?? ''" [required]="required() ?? false" [value]="value() ?? ''" />
      <ng-content />
    </section>
  `,
})
export class TextInput {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly required = input<boolean | undefined>(undefined);
  readonly value = input<string | undefined>(undefined);
  readonly defaultValue = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-input-text', this.className()].filter(Boolean).join(' '),
  );
}
