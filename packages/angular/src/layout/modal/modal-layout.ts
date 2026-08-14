import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ModalLayoutProps {
  title?: string;
  body?: string;
  confirmLabel?: string;
  open?: boolean;
  onConfirm?: () => void;
  className?: string;
}

/** @rosettadash/angular/layout/modal — layout.modal */
@Component({
  selector: 'rd-modal',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-modal'" [ngClass]="rootClass()" role="dialog" aria-modal="true">
      <div class="rd-modal__dialog">
        <span class="rd-modal__title">{{ title() ?? 'Dialog' }}</span>
        @if (body()) { <p class="rd-modal__body">{{ body() }}</p> }
        <button type="button" class="rd-modal__confirm">{{ confirmLabel() ?? 'Confirm' }}</button>
        <ng-content />
      </div>
    </section>
  `,
})
export class ModalLayout {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly body = input<string | undefined>(undefined);
  readonly confirmLabel = input<string | undefined>(undefined);
  readonly open = input<boolean | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-modal', this.className()].filter(Boolean).join(' '),
  );
}
