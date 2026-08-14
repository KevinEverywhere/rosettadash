import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface TextareaInputProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/** @rosettadash/angular/visual/input/textarea — visual.input.textarea */
@Component({
  selector: 'rd-input-textarea',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-input-textarea'" [ngClass]="rootClass()">
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      <textarea class="rd-textarea" [rows]="rows() ?? 4" [placeholder]="placeholder() ?? ''">{{ value() ?? '' }}</textarea>
      <ng-content />
    </section>
  `,
})
export class TextareaInput {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly rows = input<number | undefined>(undefined);
  readonly value = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-input-textarea', this.className()].filter(Boolean).join(' '),
  );
}
