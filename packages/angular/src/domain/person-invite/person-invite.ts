import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface PersonInviteProps {
  emailPlaceholder?: string;
  onInvite?: (email: string) => void;
  className?: string;
}

/** @rosettadash/angular/domain/person-invite — domain.person-invite */
@Component({
  selector: 'rd-person-invite',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-person-invite'" [ngClass]="rootClass()">
      <span class="rd-field__label">Invite team member</span>
      <input type="email" class="rd-input" [placeholder]="emailPlaceholder() ?? 'name@company.com'" />
      <button type="button" class="rd-button">Send invite</button>
      <ng-content />
    </section>
  `,
})
export class PersonInvite {
  readonly className = input<string | undefined>(undefined);
  readonly emailPlaceholder = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-person-invite', this.className()].filter(Boolean).join(' '),
  );
}
