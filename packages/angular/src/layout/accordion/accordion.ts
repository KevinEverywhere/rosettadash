import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';

/** Public props contract for layout/accordion (parity with other runtimes). */
export interface AccordionProps {
  title: string;
  open?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

@Component({
  selector: 'rd-accordion',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section data-testid="rd-accordion" [ngClass]="rootClass()">
      <button
        type="button"
        class="rd-accordion__header"
        [attr.aria-expanded]="isOpen()"
        aria-controls="rd-accordion-panel"
        (click)="toggle()"
      >
        <span class="rd-accordion__title">{{ title() }}</span>
        <span class="rd-accordion__chevron" aria-hidden="true">›</span>
      </button>
      @if (isOpen()) {
        <div class="rd-accordion__panel" id="rd-accordion-panel" role="region">
          <ng-content />
        </div>
      }
    </section>
  `,
})
export class Accordion implements OnInit {
  readonly title = input.required<string>();
  /** Controlled open — use with `[(open)]`. */
  readonly open = input<boolean | undefined>(undefined);
  readonly defaultOpen = input(false);
  readonly className = input<string | undefined>(undefined);

  readonly openChange = output<boolean>();
  readonly toggleChange = output<boolean>();

  private readonly uncontrolledOpen = signal(false);

  readonly isOpen = computed(() => {
    const controlled = this.open();
    return controlled !== undefined ? controlled : this.uncontrolledOpen();
  });

  readonly rootClass = computed(() =>
    ['rd-accordion', this.isOpen() ? 'rd-accordion--open' : '', this.className()]
      .filter(Boolean)
      .join(' '),
  );

  ngOnInit(): void {
    this.uncontrolledOpen.set(this.defaultOpen());
  }

  toggle(): void {
    const next = !this.isOpen();
    if (this.open() === undefined) {
      this.uncontrolledOpen.set(next);
    }
    this.openChange.emit(next);
    this.toggleChange.emit(next);
  }
}
