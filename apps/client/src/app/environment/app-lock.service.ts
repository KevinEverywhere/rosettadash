import { Injectable, signal } from '@angular/core';
import {
  APP_LOCK_CONFIG_KEY,
  APP_LOCK_SESSION_KEY,
  createPassphraseVerifier,
  type AppLockConfig,
  verifyPassphrase,
} from '@dashbuilder/core';

@Injectable({ providedIn: 'root' })
export class AppLockService {
  readonly config = signal<AppLockConfig | null>(null);
  readonly unlocked = signal(false);
  readonly error = signal<string | null>(null);

  private activePassphrase: string | null = null;

  initialize(): void {
    const raw = this.getLocalStorage()?.getItem(APP_LOCK_CONFIG_KEY);
    if (!raw) {
      this.config.set(null);
      this.unlocked.set(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AppLockConfig;
      this.config.set(parsed.enabled ? parsed : null);
    } catch {
      this.config.set(null);
    }

    const enabled = !!this.config()?.enabled;
    const sessionUnlocked = this.getSessionStorage()?.getItem(APP_LOCK_SESSION_KEY) === '1';
    this.unlocked.set(!enabled || sessionUnlocked);
  }

  isEnabled(): boolean {
    return !!this.config()?.enabled;
  }

  isUnlocked(): boolean {
    return !this.isEnabled() || this.unlocked();
  }

  getPassphrase(): string | null {
    return this.isUnlocked() ? this.activePassphrase : null;
  }

  getEncryptionSaltBase64(): string | null {
    return this.config()?.encryptionSalt ?? null;
  }

  async enableLock(passphrase: string): Promise<void> {
    const created = await createPassphraseVerifier(passphrase);
    const next: AppLockConfig = {
      enabled: true,
      verifierSalt: created.verifierSalt,
      verifierHash: created.verifierHash,
      encryptionSalt: created.encryptionSalt,
    };
    this.getLocalStorage()?.setItem(APP_LOCK_CONFIG_KEY, JSON.stringify(next));
    this.config.set(next);
    this.markUnlocked(passphrase);
    this.error.set(null);
  }

  async unlock(passphrase: string): Promise<boolean> {
    const current = this.config();
    if (!current?.enabled) {
      this.unlocked.set(true);
      return true;
    }

    const ok = await verifyPassphrase(passphrase, current.verifierSalt, current.verifierHash);
    if (!ok) {
      this.error.set('Incorrect password.');
      this.unlocked.set(false);
      this.activePassphrase = null;
      return false;
    }

    this.markUnlocked(passphrase);
    this.error.set(null);
    return true;
  }

  lock(): void {
    if (!this.isEnabled()) {
      return;
    }
    this.unlocked.set(false);
    this.activePassphrase = null;
    this.getSessionStorage()?.removeItem(APP_LOCK_SESSION_KEY);
  }

  disableLock(passphrase: string): Promise<boolean> {
    return this.unlock(passphrase).then((ok) => {
      if (!ok) {
        return false;
      }
      this.getLocalStorage()?.removeItem(APP_LOCK_CONFIG_KEY);
      this.config.set(null);
      this.unlocked.set(true);
      this.activePassphrase = null;
      this.getSessionStorage()?.removeItem(APP_LOCK_SESSION_KEY);
      return true;
    });
  }

  private markUnlocked(passphrase: string): void {
    this.activePassphrase = passphrase;
    this.unlocked.set(true);
    this.getSessionStorage()?.setItem(APP_LOCK_SESSION_KEY, '1');
  }

  private getSessionStorage(): Storage | null {
    return typeof sessionStorage !== 'undefined' ? sessionStorage : null;
  }

  private getLocalStorage(): Storage | null {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  }
}
