import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppLockService } from './app-lock.service';
import { EnvironmentConfigService } from './environment-config.service';

type GateMode = 'password' | 'recovery' | 'reset';

@Component({
  selector: 'app-app-lock-gate',
  imports: [FormsModule],
  templateUrl: './app-lock-gate.component.html',
  styleUrl: './app-lock-gate.component.scss',
})
export class AppLockGateComponent {
  protected readonly appLock = inject(AppLockService);
  private readonly config = inject(EnvironmentConfigService);

  protected readonly mode = signal<GateMode>('password');
  protected readonly password = signal('');
  protected readonly recoveryCode = signal('');
  protected readonly confirmReset = signal(false);

  protected showRecovery(): void {
    this.mode.set('recovery');
    this.appLock.error.set(null);
  }

  protected showReset(): void {
    this.mode.set('reset');
    this.confirmReset.set(false);
    this.appLock.error.set(null);
  }

  protected backToPassword(): void {
    this.mode.set('password');
    this.recoveryCode.set('');
    this.confirmReset.set(false);
    this.appLock.error.set(null);
  }

  protected async submitPassword(): Promise<void> {
    const ok = await this.appLock.unlock(this.password());
    if (!ok) {
      return;
    }
    await this.config.reloadSecrets();
    this.password.set('');
  }

  protected async submitRecoveryCode(): Promise<void> {
    const ok = await this.appLock.unlockWithRecoveryCode(this.recoveryCode());
    if (!ok) {
      return;
    }
    await this.config.reloadSecrets();
    this.recoveryCode.set('');
  }

  protected resetVault(): void {
    if (!this.confirmReset()) {
      this.appLock.error.set('Confirm that you understand saved secrets will be removed.');
      return;
    }
    this.config.resetLockedVault();
    this.backToPassword();
  }
}
