import { Component, input, output } from '@angular/core';

/** Visual treatment — maps to `app-collapsible--*` modifier classes. */
export type AppCollapsibleAppearance = 'stack' | 'admin' | 'card';

@Component({
  selector: 'app-collapsible',
  templateUrl: './app-collapsible.component.html',
  styleUrl: './app-collapsible.component.scss',
})
export class AppCollapsibleComponent {
  readonly expanded = input(false);
  readonly appearance = input<AppCollapsibleAppearance>('stack');
  readonly summaryPlaceholder = input(false);
  readonly disabled = input(false);
  readonly toggleTestId = input<string | undefined>(undefined);
  readonly panelTestId = input<string | undefined>(undefined);

  readonly toggled = output<void>();

  protected onToggle(): void {
    if (this.disabled()) {
      return;
    }
    this.toggled.emit();
  }
}
