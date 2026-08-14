import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface CollapsibleProps {
  title?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** @rosettadash/angular/layout/collapsible — layout.collapsible */
@Component({
  selector: 'rd-collapsible',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-collapsible'" [ngClass]="rootClass()">
      <button type="button" class="rd-collapsible__header" [attr.aria-expanded]="open() ?? defaultOpen() ?? false">
        <span>{{ title() ?? 'Section' }}</span>
      </button>
      <div class="rd-collapsible__panel"><ng-content /></div>
    </section>
  `,
})
export class Collapsible {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly open = input<boolean | undefined>(undefined);
  readonly defaultOpen = input<boolean | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-collapsible', this.className()].filter(Boolean).join(' '),
  );
}
