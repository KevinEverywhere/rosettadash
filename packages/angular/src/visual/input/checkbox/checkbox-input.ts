import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface CheckboxInputProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

/** @rosettadash/angular/visual/input/checkbox — visual.input.checkbox */
@Component({
  selector: 'rd-input-checkbox',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [attr.data-testid]="'rd-input-checkbox'" [ngClass]="rootClass() + ' rd-field--checkbox'">
      <input type="checkbox" class="rd-checkbox" [checked]="checked() ?? defaultChecked() ?? false" />
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      <ng-content />
    </label>
  `,
})
export class CheckboxInput {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly checked = input<boolean | undefined>(undefined);
  readonly defaultChecked = input<boolean | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-input-checkbox', this.className()].filter(Boolean).join(' '),
  );
}
