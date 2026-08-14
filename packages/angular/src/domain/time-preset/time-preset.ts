import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface TimePresetPreset {
  id: string;
  label: string;
}

export interface TimePresetProps {
  label?: string;
  presets?: TimePresetPreset[];
  activePresetId?: string;
  onPresetChange?: (presetId: string) => void;
  className?: string;
}

/** @rosettadash/angular/domain/time-preset — domain.time-preset */
@Component({
  selector: 'rd-time-preset',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-time-preset'" [ngClass]="rootClass()">
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      <div class="rd-time-preset__buttons" role="group">
        @for (p of presets() ?? []; track p.id) {
          <button type="button" [class]="presetButtonClass(p.id)">{{ p.label }}</button>
        }
      </div>
      <ng-content />
    </section>
  `,
})
export class TimePreset {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly presets = input<TimePresetPreset[] | undefined>(undefined);
  readonly activePresetId = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-time-preset', this.className()].filter(Boolean).join(' '),
  );
  presetButtonClass(id: string): string {
    return ['rd-time-preset__button', this.activePresetId() === id ? 'rd-time-preset__button--active' : ''].filter(Boolean).join(' ');
  }
}
