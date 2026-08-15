import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { ThemePreference } from '../services/theme.service';

@Component({
  selector: 'da-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="da-theme-toggle" [class]="className()">
      <span>Theme</span>
      <select
        [value]="theme()"
        aria-label="Color theme"
        (change)="themeChange.emit($any($event.target).value)"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  `,
})
export class ThemeToggleComponent {
  readonly theme = input.required<ThemePreference>();
  readonly className = input<string>();
  readonly themeChange = output<ThemePreference>();
}
