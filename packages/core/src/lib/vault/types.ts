import type { EncryptedPayload } from '../byok/crypto-storage';

export interface RecoveryCodeRecord {
  verifierSalt: string;
  verifierHash: string;
  wrappedPassphraseSalt: string;
  wrappedPassphrase: EncryptedPayload;
}

export interface AppLockConfig {
  enabled: boolean;
  /** Base64-encoded PBKDF2 salt for the password verifier. */
  verifierSalt: string;
  /** Base64-encoded SHA-256 digest of derived verifier bytes. */
  verifierHash: string;
  /** Base64-encoded salt used with the passphrase for secret encryption. */
  encryptionSalt: string;
  /** Optional non-secret hint to jog memory — never used for crypto. */
  passwordHint?: string;
  /** Single-use recovery code records generated at enable time. */
  recoveryCodes?: RecoveryCodeRecord[];
}

export const APP_LOCK_SESSION_KEY = 'rosettadash:vault:unlocked';

export const APP_LOCK_CONFIG_KEY = 'rosettadash:vault:config';
