import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'da-collapsible',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rd-collapsible" [class.is-open]="open()">
      <button
        type="button"
        class="rd-collapsible__header"
        [attr.aria-expanded]="open()"
        (click)="toggle()"
      >
        <span class="rd-collapsible__titles">
          <span class="rd-collapsible__title">{{ panelTitle() }}</span>
          @if (panelSummary()) {
            <span class="rd-collapsible__summary">{{ panelSummary() }}</span>
          }
        </span>
        <span class="rd-collapsible__chevron" aria-hidden="true">{{ open() ? '▾' : '▸' }}</span>
      </button>
      @if (open()) {
        <div class="rd-collapsible__panel">
          <ng-content />
        </div>
      }
    </section>
  `,
})
export class CollapsibleComponent {
  readonly panelTitle = input('Section');
  readonly panelSummary = input<string>();
  readonly open = input(false);
  readonly openChange = output<boolean>();

  toggle(): void {
    this.openChange.emit(!this.open());
  }
}
