import type { EncryptedPayload } from '../byok/crypto-storage';
import { generateStorageSalt } from '../byok/crypto-storage';

const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 120_000;

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

function normalizeBytes(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  return new Uint8Array(bytes);
}

async function importPassphraseMaterial(passphrase: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  );
}

async function deriveAesKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await importPassphraseMaterial(passphrase);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: normalizeBytes(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function createPassphraseVerifier(passphrase: string): Promise<{
  verifierSalt: string;
  verifierHash: string;
  encryptionSalt: string;
}> {
  const verifierSalt = generateStorageSalt();
  const encryptionSalt = generateStorageSalt();
  const material = await importPassphraseMaterial(passphrase);
  const verifierBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: normalizeBytes(verifierSalt),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    material,
    256,
  );

  return {
    verifierSalt: toBase64(verifierSalt),
    verifierHash: toBase64(new Uint8Array(verifierBits)),
    encryptionSalt: toBase64(encryptionSalt),
  };
}

export async function verifyPassphrase(
  passphrase: string,
  verifierSaltBase64: string,
  verifierHashBase64: string,
): Promise<boolean> {
  const material = await importPassphraseMaterial(passphrase);
  const verifierBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: normalizeBytes(fromBase64(verifierSaltBase64)),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    material,
    256,
  );
  return toBase64(new Uint8Array(verifierBits)) === verifierHashBase64;
}

export async function encryptWithPassphrase(
  plaintext: string,
  passphrase: string,
  encryptionSaltBase64: string,
): Promise<EncryptedPayload> {
  const key = await deriveAesKey(passphrase, fromBase64(encryptionSaltBase64));
  const iv = new Uint8Array(IV_LENGTH);
  crypto.getRandomValues(iv);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  );

  return {
    v: 1,
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(ciphertext)),
  };
}

export async function decryptWithPassphrase(
  payload: EncryptedPayload,
  passphrase: string,
  encryptionSaltBase64: string,
): Promise<string> {
  const key = await deriveAesKey(passphrase, fromBase64(encryptionSaltBase64));
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: normalizeBytes(fromBase64(payload.iv)) },
    key,
    normalizeBytes(fromBase64(payload.data)),
  );
  return new TextDecoder().decode(plaintext);
}
