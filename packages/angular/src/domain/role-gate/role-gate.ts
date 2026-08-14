import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface RoleGateProps {
  label?: string;
  allowedRoles?: string[];
  statusText?: string;
  className?: string;
}

/** @rosettadash/angular/domain/role-gate — domain.role-gate */
@Component({
  selector: 'rd-role-gate',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-role-gate'" [ngClass]="rootClass()">
      @if (label()) { <span class="rd-field__label">{{ label() }}</span> }
      <p class="rd-role-gate__status">{{ statusText() ?? 'Visible' }}</p>
      <ng-content />
    </section>
  `,
})
export class RoleGate {
  readonly className = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly allowedRoles = input<string[] | undefined>(undefined);
  readonly statusText = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-role-gate', this.className()].filter(Boolean).join(' '),
  );
}
