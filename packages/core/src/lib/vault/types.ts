export interface AppLockConfig {
  enabled: boolean;
  /** Base64-encoded PBKDF2 salt for the password verifier. */
  verifierSalt: string;
  /** Base64-encoded SHA-256 digest of derived verifier bytes. */
  verifierHash: string;
  /** Base64-encoded salt used with the passphrase for secret encryption. */
  encryptionSalt: string;
}

export const APP_LOCK_SESSION_KEY = 'dashbuilder:vault:unlocked';

export const APP_LOCK_CONFIG_KEY = 'dashbuilder:vault:config';
