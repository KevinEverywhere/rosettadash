import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_NAME } from '@rosettadash/core';

@Component({
  selector: 'app-builder-auth-gate',
  imports: [FormsModule],
  templateUrl: './builder-auth-gate.component.html',
  styleUrl: './builder-auth-gate.component.scss',
})
export class BuilderAuthGateComponent {
  protected readonly appName = APP_NAME;

  readonly error = input<string | null>(null);
  readonly login = output<string>();

  protected apiKey = '';

  protected submit(): void {
    const trimmed = this.apiKey.trim();
    if (!trimmed) {
      return;
    }
    this.login.emit(trimmed);
  }
}
