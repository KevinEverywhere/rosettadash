import { inject, Injectable, signal } from '@angular/core';
import {
  decryptSecretPayload,
  decryptWithPassphrase,
  encryptSecretPayload,
  encryptWithPassphrase,
  generateStorageSalt,
  getDefaultByokSettings,
  parseEncryptedPayload,
  serializeEncryptedPayload,
  validationKeyForAiProvider,
  validationKeyForEnvField,
  type AiProviderId,
  type ByokSettings,
  type CredentialValidationMap,
  type CredentialValidationRecord,
  type CredentialValidationStatus,
  type EnvironmentStorageSettings,
} from '@dashbuilder/core';
import { AppLockService } from './app-lock.service';

const SETTINGS_KEY = 'dashbuilder:environment:settings';
const SECRETS_KEY = 'dashbuilder:environment:secrets';
const PLAIN_KEY = 'dashbuilder:environment:plain';
const SALT_KEY = 'dashbuilder:environment:salt';

const DEFAULT_SETTINGS: EnvironmentStorageSettings = {
  rememberKeys: false,
  byok: getDefaultByokSettings(),
};

@Injectable({ providedIn: 'root' })
export class EnvironmentConfigService {
  private readonly appLock = inject(AppLockService);

  readonly settings = signal<EnvironmentStorageSettings>(DEFAULT_SETTINGS);
  readonly plainValues = signal<Record<string, string>>({});
  readonly secretKeys = signal<string[]>([]);
  readonly validation = signal<CredentialValidationMap>({});
  readonly loaded = signal(false);
  readonly saveMessage = signal<string | null>(null);

  private secretValues = new Map<string, string>();
  private salt: Uint8Array | null = null;

  async initialize(): Promise<void> {
    this.loaded.set(false);
    this.appLock.initialize();
    await this.loadFromStorage();
    this.loaded.set(true);
  }

  async reloadSecrets(): Promise<void> {
    await this.loadSecretsFromStorage();
  }

  getValue(envKey: string): string {
    if (this.plainValues()[envKey] !== undefined) {
      return this.plainValues()[envKey];
    }
    return this.secretValues.get(envKey) ?? '';
  }

  hasSecretValue(envKey: string): boolean {
    return this.secretValues.has(envKey) && !!this.secretValues.get(envKey);
  }

  setPlainValue(envKey: string, value: string): void {
    this.plainValues.update((current) => ({ ...current, [envKey]: value }));
    this.resetValidationForEnvKey(envKey);
  }

  setSecretValue(envKey: string, value: string): void {
    if (!value) {
      this.secretValues.delete(envKey);
    } else {
      this.secretValues.set(envKey, value);
    }
    this.secretKeys.set([...this.secretValues.keys()]);
    this.resetValidationForEnvKey(envKey);
  }

  getValidation(key: string): CredentialValidationRecord {
    return this.validation()[key] ?? { status: 'unknown' };
  }

  getEnvFieldValidation(envKey: string): CredentialValidationRecord {
    return this.getValidation(validationKeyForEnvField(envKey));
  }

  getAiProviderValidation(providerId: AiProviderId): CredentialValidationRecord {
    return this.getValidation(validationKeyForAiProvider(providerId));
  }

  setEnvFieldValidation(
    envKey: string,
    status: CredentialValidationStatus,
    message?: string,
  ): void {
    this.setValidation(validationKeyForEnvField(envKey), status, message);
  }

  setAiProviderValidation(
    providerId: AiProviderId,
    status: CredentialValidationStatus,
    message?: string,
  ): void {
    this.setValidation(validationKeyForAiProvider(providerId), status, message);
    const provider = this.getValidationKeyForProviderApiKey(providerId);
    if (provider) {
      this.setValidation(validationKeyForEnvField(provider), status, message);
    }
  }

  private setValidation(
    key: string,
    status: CredentialValidationStatus,
    message?: string,
  ): void {
    this.validation.update((current) => ({
      ...current,
      [key]: {
        status,
        message,
        checkedAt: new Date().toISOString(),
      },
    }));
  }

  resetValidationForEnvKey(envKey: string): void {
    this.validation.update((current) => {
      const next = { ...current };
      delete next[validationKeyForEnvField(envKey)];
      const providerKey = this.getProviderValidationKeyForEnvKey(envKey);
      if (providerKey) {
        delete next[providerKey];
      }
      return next;
    });
  }

  resetAiProviderValidation(providerId: AiProviderId): void {
    this.validation.update((current) => {
      const next = { ...current };
      delete next[validationKeyForAiProvider(providerId)];
      return next;
    });
  }

  updateByokSettings(patch: Partial<ByokSettings>): void {
    this.settings.update((current) => ({
      ...current,
      byok: { ...current.byok, ...patch },
    }));
    if (
      patch.customBaseUrl !== undefined ||
      patch.azureResourceName !== undefined ||
      patch.azureDeploymentId !== undefined
    ) {
      this.resetAiProviderValidation('azure-openai');
    }
  }

  setRememberKeys(remember: boolean): void {
    this.settings.update((current) => ({
      ...current,
      rememberKeys: remember,
      byok: { ...current.byok, rememberKeys: remember },
    }));
  }

  async save(): Promise<void> {
    const sessionStorageRef = this.getSessionStorage();
    const localStorageRef = this.getLocalStorage();
    if (!sessionStorageRef) {
      return;
    }

    const settings = this.settings();
    const settingsJson = JSON.stringify({
      ...settings,
      validation: this.validation(),
    });

    sessionStorageRef.setItem(SETTINGS_KEY, settingsJson);
    if (settings.rememberKeys && localStorageRef) {
      localStorageRef.setItem(SETTINGS_KEY, settingsJson);
    } else if (localStorageRef) {
      localStorageRef.removeItem(SETTINGS_KEY);
    }

    sessionStorageRef.setItem(PLAIN_KEY, JSON.stringify(this.plainValues()));
    if (settings.rememberKeys && localStorageRef) {
      localStorageRef.setItem(PLAIN_KEY, JSON.stringify(this.plainValues()));
    } else if (localStorageRef) {
      localStorageRef.removeItem(PLAIN_KEY);
    }

    const salt = await this.ensureSalt();
    const secretPayload = JSON.stringify(Object.fromEntries(this.secretValues.entries()));
    const encrypted = await this.encryptSecrets(secretPayload, salt);
    const encryptedJson = serializeEncryptedPayload(encrypted);

    const persistLocally = settings.rememberKeys || this.appLock.isEnabled();
    sessionStorageRef.setItem(SECRETS_KEY, encryptedJson);
    if (persistLocally && localStorageRef) {
      localStorageRef.setItem(SECRETS_KEY, encryptedJson);
      if (!this.appLock.isEnabled()) {
        localStorageRef.setItem(SALT_KEY, this.encodeSalt(salt));
      }
    } else if (localStorageRef) {
      localStorageRef.removeItem(SECRETS_KEY);
      if (!this.appLock.isEnabled()) {
        localStorageRef.removeItem(SALT_KEY);
      }
    }

    if (!this.appLock.isEnabled()) {
      sessionStorageRef.setItem(SALT_KEY, this.encodeSalt(salt));
    }

    const builderKey = this.secretValues.get('DASHBUILDER_API_KEY');
    if (builderKey) {
      sessionStorageRef.setItem('dashbuilder:apiKey', builderKey);
    }

    this.saveMessage.set('Environment settings saved in this browser.');
  }

  clearAll(): void {
    this.settings.set(DEFAULT_SETTINGS);
    this.plainValues.set({});
    this.secretValues.clear();
    this.secretKeys.set([]);
    this.validation.set({});
    this.salt = null;

    for (const storage of [this.getSessionStorage(), this.getLocalStorage()]) {
      if (!storage) {
        continue;
      }
      storage.removeItem(SETTINGS_KEY);
      storage.removeItem(SECRETS_KEY);
      storage.removeItem(PLAIN_KEY);
      storage.removeItem(SALT_KEY);
    }

    this.getSessionStorage()?.removeItem('dashbuilder:apiKey');
    this.saveMessage.set('Cleared environment values from this browser.');
  }

  resetLockedVault(): void {
    this.appLock.resetVault();
    this.clearAll();
    this.loaded.set(true);
    this.saveMessage.set(
      'Vault reset. Encrypted secrets were removed — re-enter your API keys when ready.',
    );
  }

  private async loadFromStorage(): Promise<void> {
    const sessionStorageRef = this.getSessionStorage();
    const localStorageRef = this.getLocalStorage();
    const rememberFromLocal =
      localStorageRef?.getItem(SETTINGS_KEY) &&
      JSON.parse(localStorageRef.getItem(SETTINGS_KEY) ?? '{}').rememberKeys;

    const settingsRaw =
      (rememberFromLocal ? localStorageRef?.getItem(SETTINGS_KEY) : null) ??
      sessionStorageRef?.getItem(SETTINGS_KEY);

    if (settingsRaw) {
      try {
        const parsed = JSON.parse(settingsRaw) as EnvironmentStorageSettings;
        this.settings.set({
          rememberKeys: parsed.rememberKeys ?? false,
          byok: { ...getDefaultByokSettings(), ...parsed.byok },
          validation: parsed.validation ?? {},
        });
        this.validation.set(parsed.validation ?? {});
      } catch {
        this.settings.set(DEFAULT_SETTINGS);
      }
    }

    const plainRaw =
      (rememberFromLocal ? localStorageRef?.getItem(PLAIN_KEY) : null) ??
      sessionStorageRef?.getItem(PLAIN_KEY);

    if (plainRaw && (!this.appLock.isEnabled() || this.appLock.isUnlocked())) {
      try {
        this.plainValues.set(JSON.parse(plainRaw) as Record<string, string>);
      } catch {
        this.plainValues.set({});
      }
    }

    await this.loadSecretsFromStorage();
  }

  private async loadSecretsFromStorage(): Promise<void> {
    const sessionStorageRef = this.getSessionStorage();
    const localStorageRef = this.getLocalStorage();
    const rememberFromLocal =
      localStorageRef?.getItem(SETTINGS_KEY) &&
      JSON.parse(localStorageRef.getItem(SETTINGS_KEY) ?? '{}').rememberKeys;

    if (this.appLock.isEnabled() && !this.appLock.isUnlocked()) {
      this.secretValues.clear();
      this.secretKeys.set([]);
      return;
    }

    const saltRaw =
      (rememberFromLocal ? localStorageRef?.getItem(SALT_KEY) : null) ??
      sessionStorageRef?.getItem(SALT_KEY);

    if (saltRaw && !this.appLock.isEnabled()) {
      this.salt = this.decodeSalt(saltRaw);
    }

    const secretsRaw =
      (this.appLock.isEnabled()
        ? localStorageRef?.getItem(SECRETS_KEY)
        : rememberFromLocal
          ? localStorageRef?.getItem(SECRETS_KEY)
          : null) ??
      sessionStorageRef?.getItem(SECRETS_KEY);

    if (!secretsRaw) {
      this.secretValues.clear();
      this.secretKeys.set([]);
      return;
    }

    try {
      const payload = parseEncryptedPayload(secretsRaw);
      const decrypted = await this.decryptSecrets(payload);
      const parsed = JSON.parse(decrypted) as Record<string, string>;
      this.secretValues = new Map(Object.entries(parsed));
      this.secretKeys.set([...this.secretValues.keys()]);
    } catch {
      this.secretValues.clear();
      this.secretKeys.set([]);
    }
  }

  private async encryptSecrets(secretPayload: string, salt: Uint8Array) {
    if (this.appLock.isEnabled()) {
      const passphrase = this.appLock.getPassphrase();
      const encryptionSalt = this.appLock.getEncryptionSaltBase64();
      if (!passphrase || !encryptionSalt) {
        throw new Error('App lock is enabled but vault is locked.');
      }
      return encryptWithPassphrase(secretPayload, passphrase, encryptionSalt);
    }
    return encryptSecretPayload(secretPayload, salt);
  }

  private async decryptSecrets(payload: ReturnType<typeof parseEncryptedPayload>): Promise<string> {
    if (this.appLock.isEnabled()) {
      const passphrase = this.appLock.getPassphrase();
      const encryptionSalt = this.appLock.getEncryptionSaltBase64();
      if (!passphrase || !encryptionSalt) {
        throw new Error('App lock is enabled but vault is locked.');
      }
      return decryptWithPassphrase(payload, passphrase, encryptionSalt);
    }
    if (!this.salt) {
      throw new Error('Missing storage salt.');
    }
    return decryptSecretPayload(payload, this.salt);
  }

  private getProviderValidationKeyForEnvKey(envKey: string): string | null {
    const map: Record<string, AiProviderId> = {
      OPENAI_API_KEY: 'openai',
      ANTHROPIC_API_KEY: 'anthropic',
      GOOGLE_AI_API_KEY: 'google',
      AZURE_OPENAI_API_KEY: 'azure-openai',
      OLLAMA_API_KEY: 'ollama',
    };
    const providerId = map[envKey];
    return providerId ? validationKeyForAiProvider(providerId) : null;
  }

  private getValidationKeyForProviderApiKey(providerId: AiProviderId): string | null {
    const map: Record<AiProviderId, string> = {
      openai: 'OPENAI_API_KEY',
      anthropic: 'ANTHROPIC_API_KEY',
      google: 'GOOGLE_AI_API_KEY',
      'azure-openai': 'AZURE_OPENAI_API_KEY',
      ollama: 'OLLAMA_API_KEY',
    };
    return map[providerId] ?? null;
  }

  private async ensureSalt(): Promise<Uint8Array> {
    if (this.salt) {
      return this.salt;
    }
    this.salt = generateStorageSalt();
    return this.salt;
  }

  private encodeSalt(salt: Uint8Array): string {
    return Array.from(salt)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  private decodeSalt(raw: string): Uint8Array {
    const pairs = raw.match(/.{1,2}/g) ?? [];
    return new Uint8Array(pairs.map((pair) => parseInt(pair, 16)));
  }

  private getSessionStorage(): Storage | null {
    return typeof sessionStorage !== 'undefined' ? sessionStorage : null;
  }

  private getLocalStorage(): Storage | null {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  }
}
