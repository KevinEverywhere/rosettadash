import { Injectable, signal } from '@angular/core';
import {
  APP_LOCK_CONFIG_KEY,
  APP_LOCK_SESSION_KEY,
  createPassphraseVerifier,
  generateRecoveryKit,
  normalizeRecoveryCode,
  type AppLockConfig,
  type RecoveryCodeRecord,
  unwrapPassphraseWithRecoveryCode,
  verifyPassphrase,
  verifyRecoveryCodeRecord,
} from '@rosettadash/core';

export interface EnableAppLockResult {
  recoveryCodes: string[];
}

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

  passwordHint(): string | null {
    const hint = this.config()?.passwordHint?.trim();
    return hint || null;
  }

  remainingRecoveryCodes(): number {
    return this.config()?.recoveryCodes?.length ?? 0;
  }

  getPassphrase(): string | null {
    return this.isUnlocked() ? this.activePassphrase : null;
  }

  getEncryptionSaltBase64(): string | null {
    return this.config()?.encryptionSalt ?? null;
  }

  async enableLock(
    passphrase: string,
    options?: { passwordHint?: string },
  ): Promise<EnableAppLockResult> {
    const created = await createPassphraseVerifier(passphrase);
    const kit = await generateRecoveryKit(passphrase);
    const next: AppLockConfig = {
      enabled: true,
      verifierSalt: created.verifierSalt,
      verifierHash: created.verifierHash,
      encryptionSalt: created.encryptionSalt,
      passwordHint: options?.passwordHint?.trim() || undefined,
      recoveryCodes: kit.records,
    };
    this.persistConfig(next);
    this.markUnlocked(passphrase);
    this.error.set(null);
    return { recoveryCodes: kit.codes };
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

  async unlockWithRecoveryCode(code: string): Promise<boolean> {
    const current = this.config();
    if (!current?.enabled) {
      this.unlocked.set(true);
      return true;
    }

    const normalized = normalizeRecoveryCode(code);
    if (!normalized) {
      this.error.set('Enter a recovery code.');
      return false;
    }

    const records = current.recoveryCodes ?? [];
    let matchedIndex = -1;
    let matchedRecord: RecoveryCodeRecord | null = null;

    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      if (await verifyRecoveryCodeRecord(normalized, record)) {
        matchedIndex = index;
        matchedRecord = record;
        break;
      }
    }

    if (!matchedRecord || matchedIndex < 0) {
      this.error.set('Recovery code not recognized.');
      return false;
    }

    try {
      const passphrase = await unwrapPassphraseWithRecoveryCode(normalized, matchedRecord);
      const nextRecords = records.filter((_, index) => index !== matchedIndex);
      this.persistConfig({ ...current, recoveryCodes: nextRecords });
      this.markUnlocked(passphrase);
      this.error.set(null);
      return true;
    } catch {
      this.error.set('Recovery code could not unlock the vault.');
      return false;
    }
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

  resetVault(): void {
    this.getLocalStorage()?.removeItem(APP_LOCK_CONFIG_KEY);
    this.config.set(null);
    this.unlocked.set(true);
    this.activePassphrase = null;
    this.error.set(null);
    this.getSessionStorage()?.removeItem(APP_LOCK_SESSION_KEY);
  }

  private markUnlocked(passphrase: string): void {
    this.activePassphrase = passphrase;
    this.unlocked.set(true);
    this.getSessionStorage()?.setItem(APP_LOCK_SESSION_KEY, '1');
  }

  private persistConfig(config: AppLockConfig): void {
    this.getLocalStorage()?.setItem(APP_LOCK_CONFIG_KEY, JSON.stringify(config));
    this.config.set(config);
  }

  private getSessionStorage(): Storage | null {
    return typeof sessionStorage !== 'undefined' ? sessionStorage : null;
  }

  private getLocalStorage(): Storage | null {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  }
}
