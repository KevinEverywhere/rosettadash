import {
  decryptSecretPayload,
  encryptSecretPayload,
  generateStorageSalt,
  parseEncryptedPayload,
  serializeEncryptedPayload,
} from './crypto-storage';
import { canonicalConsumerSecretKey } from './integration-catalog';

const SETTINGS_KEY = 'rosettadash:consumer:settings';
const SECRETS_KEY = 'rosettadash:consumer:secrets';
const SALT_KEY = 'rosettadash:consumer:salt';

export interface ConsumerSecretsSettings {
  rememberKeys: boolean;
}

const DEFAULT_SETTINGS: ConsumerSecretsSettings = {
  rememberKeys: false,
};

export interface ConsumerSecretsSnapshot {
  settings: ConsumerSecretsSettings;
  secretKeys: string[];
}

export type ConsumerSecretsListener = (snapshot: ConsumerSecretsSnapshot) => void;

/**
 * Framework-agnostic BYOK vault for consumer apps (Destination Atlas proof apps).
 * Mirrors builder encryption but uses a separate storage namespace.
 */
export class ConsumerSecretsStore {
  private settings: ConsumerSecretsSettings = { ...DEFAULT_SETTINGS };
  private secretValues = new Map<string, string>();
  private salt: Uint8Array | null = null;
  private loaded = false;
  private listeners = new Set<ConsumerSecretsListener>();

  get isLoaded(): boolean {
    return this.loaded;
  }

  getSettings(): ConsumerSecretsSettings {
    return { ...this.settings };
  }

  subscribe(listener: ConsumerSecretsListener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  async initialize(): Promise<void> {
    this.loaded = false;
    await this.loadFromStorage();
    this.loaded = true;
    this.emit();
  }

  getValue(envKey: string): string {
    const canonical = canonicalConsumerSecretKey(envKey);
    return this.secretValues.get(canonical) ?? '';
  }

  hasSecretValue(envKey: string): boolean {
    const canonical = canonicalConsumerSecretKey(envKey);
    return this.secretValues.has(canonical) && !!this.secretValues.get(canonical);
  }

  setSecretValue(envKey: string, value: string): void {
    const canonical = canonicalConsumerSecretKey(envKey);
    if (!value) {
      this.secretValues.delete(canonical);
    } else {
      this.secretValues.set(canonical, value);
    }
    this.emit();
  }

  setRememberKeys(remember: boolean): void {
    this.settings = { ...this.settings, rememberKeys: remember };
    this.emit();
  }

  async save(): Promise<void> {
    const sessionStorageRef = this.getSessionStorage();
    const localStorageRef = this.getLocalStorage();
    if (!sessionStorageRef) {
      return;
    }

    const settingsJson = JSON.stringify(this.settings);
    sessionStorageRef.setItem(SETTINGS_KEY, settingsJson);
    if (this.settings.rememberKeys && localStorageRef) {
      localStorageRef.setItem(SETTINGS_KEY, settingsJson);
    } else if (localStorageRef) {
      localStorageRef.removeItem(SETTINGS_KEY);
    }

    const salt = await this.ensureSalt();
    const secretPayload = JSON.stringify(Object.fromEntries(this.secretValues.entries()));
    const encrypted = await encryptSecretPayload(secretPayload, salt);
    const encryptedJson = serializeEncryptedPayload(encrypted);

    sessionStorageRef.setItem(SECRETS_KEY, encryptedJson);
    sessionStorageRef.setItem(SALT_KEY, this.encodeSalt(salt));

    if (this.settings.rememberKeys && localStorageRef) {
      localStorageRef.setItem(SECRETS_KEY, encryptedJson);
      localStorageRef.setItem(SALT_KEY, this.encodeSalt(salt));
    } else if (localStorageRef) {
      localStorageRef.removeItem(SECRETS_KEY);
      localStorageRef.removeItem(SALT_KEY);
    }

    this.emit();
  }

  clearAll(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.secretValues.clear();
    this.salt = null;

    for (const storage of [this.getSessionStorage(), this.getLocalStorage()]) {
      if (!storage) {
        continue;
      }
      storage.removeItem(SETTINGS_KEY);
      storage.removeItem(SECRETS_KEY);
      storage.removeItem(SALT_KEY);
    }

    this.emit();
  }

  private snapshot(): ConsumerSecretsSnapshot {
    return {
      settings: this.getSettings(),
      secretKeys: [...this.secretValues.keys()],
    };
  }

  private emit(): void {
    const snapshot = this.snapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
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
        const parsed = JSON.parse(settingsRaw) as ConsumerSecretsSettings;
        this.settings = { rememberKeys: parsed.rememberKeys ?? false };
      } catch {
        this.settings = { ...DEFAULT_SETTINGS };
      }
    }

    const saltRaw =
      (rememberFromLocal ? localStorageRef?.getItem(SALT_KEY) : null) ??
      sessionStorageRef?.getItem(SALT_KEY);

    if (saltRaw) {
      this.salt = this.decodeSalt(saltRaw);
    }

    const secretsRaw =
      (rememberFromLocal ? localStorageRef?.getItem(SECRETS_KEY) : null) ??
      sessionStorageRef?.getItem(SECRETS_KEY);

    if (!secretsRaw || !this.salt) {
      this.secretValues.clear();
      return;
    }

    try {
      const payload = parseEncryptedPayload(secretsRaw);
      const decrypted = await decryptSecretPayload(payload, this.salt);
      const parsed = JSON.parse(decrypted) as Record<string, string>;
      this.secretValues = new Map(
        Object.entries(parsed).map(([key, value]) => [canonicalConsumerSecretKey(key), value]),
      );
    } catch {
      this.secretValues.clear();
    }
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
