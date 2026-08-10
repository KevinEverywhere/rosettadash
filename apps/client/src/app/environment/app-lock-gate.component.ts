import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_NAME } from '@dashbuilder/core';
import { AppLockService } from './app-lock.service';
import { EnvironmentConfigService } from './environment-config.service';

@Component({
  selector: 'app-app-lock-gate',
  imports: [FormsModule],
  templateUrl: './app-lock-gate.component.html',
  styleUrl: './app-lock-gate.component.scss',
})
export class AppLockGateComponent {
  protected readonly appName = APP_NAME;
  protected readonly appLock = inject(AppLockService);
  private readonly config = inject(EnvironmentConfigService);

  readonly unlocked = output<void>();

  protected readonly password = signal('');

  protected async submit(): Promise<void> {
    const ok = await this.appLock.unlock(this.password());
    if (!ok) {
      return;
    }
    await this.config.reloadSecrets();
    this.password.set('');
    this.unlocked.emit();
  }
}
