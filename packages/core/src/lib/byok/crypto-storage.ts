const ENCRYPTION_VERSION = 1;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

export interface EncryptedPayload {
  v: number;
  iv: string;
  data: string;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function normalizeSalt(salt: Uint8Array): Uint8Array<ArrayBuffer> {
  return new Uint8Array(salt);
}

export function generateStorageSalt(): Uint8Array {
  const salt = new Uint8Array(SALT_LENGTH);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(salt);
    return salt;
  }
  for (let index = 0; index < SALT_LENGTH; index += 1) {
    salt[index] = Math.floor(Math.random() * 256);
  }
  return salt;
}

async function deriveKey(salt: Uint8Array): Promise<CryptoKey> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto is not available');
  }

  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode('rosettadash-byok-v1'),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: normalizeSalt(salt),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptSecretPayload(
  plaintext: string,
  salt: Uint8Array,
): Promise<EncryptedPayload> {
  const key = await deriveKey(salt);
  const iv = new Uint8Array(IV_LENGTH);
  crypto.getRandomValues(iv);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  );

  return {
    v: ENCRYPTION_VERSION,
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(ciphertext)),
  };
}

export async function decryptSecretPayload(
  payload: EncryptedPayload,
  salt: Uint8Array,
): Promise<string> {
  if (payload.v !== ENCRYPTION_VERSION) {
    throw new Error(`Unsupported encryption version: ${payload.v}`);
  }

  const key = await deriveKey(salt);
  const iv = fromBase64(payload.iv);
  const data = fromBase64(payload.data);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: normalizeSalt(iv) },
    key,
    normalizeSalt(data),
  );

  return new TextDecoder().decode(plaintext);
}

export function serializeEncryptedPayload(payload: EncryptedPayload): string {
  return JSON.stringify(payload);
}

export function parseEncryptedPayload(raw: string): EncryptedPayload {
  const parsed = JSON.parse(raw) as EncryptedPayload;
  if (!parsed || typeof parsed.data !== 'string' || typeof parsed.iv !== 'string') {
    throw new Error('Invalid encrypted payload');
  }
  return parsed;
}
