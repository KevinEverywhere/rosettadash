import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface RoleAssignProps {
  summary?: string;
  roleOptions?: { value: string; label: string }[];
  onConfirm?: (role: string) => void;
  className?: string;
}

/** @rosettadash/angular/domain/role-assign — domain.role-assign */
@Component({
  selector: 'rd-role-assign',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-role-assign'" [ngClass]="rootClass()">
      <span class="rd-field__label">Assign role</span>
      @if (summary()) { <p class="rd-onboarding__summary">{{ summary() }}</p> }
      <select class="rd-select">
        @for (o of roleOptions() ?? []; track o.value) {
          <option [value]="o.value">{{ o.label }}</option>
        }
      </select>
      <button type="button" class="rd-button">Confirm access</button>
      <ng-content />
    </section>
  `,
})
export class RoleAssign {
  readonly className = input<string | undefined>(undefined);
  readonly summary = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-role-assign', this.className()].filter(Boolean).join(' '),
  );
}
