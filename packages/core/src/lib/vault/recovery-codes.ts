import type { EncryptedPayload } from '../byok/crypto-storage';
import {
  createPassphraseVerifier,
  decryptWithPassphrase,
  encryptWithPassphrase,
  verifyPassphrase,
} from './passphrase-crypto';
import type { RecoveryCodeRecord } from './types';

const RECOVERY_CODE_COUNT = 8;
const CODE_SEGMENT_LENGTH = 4;
const CODE_SEGMENT_COUNT = 3;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function normalizeRecoveryCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function formatRecoveryCode(raw: string): string {
  const normalized = normalizeRecoveryCode(raw);
  const segments: string[] = [];
  for (let index = 0; index < CODE_SEGMENT_COUNT; index += 1) {
    const start = index * CODE_SEGMENT_LENGTH;
    segments.push(normalized.slice(start, start + CODE_SEGMENT_LENGTH));
  }
  return segments.filter(Boolean).join('-');
}

function generateRawRecoveryCode(): string {
  const bytes = new Uint8Array(CODE_SEGMENT_LENGTH * CODE_SEGMENT_COUNT);
  crypto.getRandomValues(bytes);
  let raw = '';
  for (const byte of bytes) {
    raw += CODE_ALPHABET[byte % CODE_ALPHABET.length];
  }
  return raw;
}

export async function createRecoveryCodeRecord(
  code: string,
  passphrase: string,
): Promise<RecoveryCodeRecord> {
  const normalized = normalizeRecoveryCode(code);
  const verifier = await createPassphraseVerifier(normalized);
  const wrappedPassphrase = await encryptWithPassphrase(
    passphrase,
    normalized,
    verifier.encryptionSalt,
  );

  return {
    verifierSalt: verifier.verifierSalt,
    verifierHash: verifier.verifierHash,
    wrappedPassphraseSalt: verifier.encryptionSalt,
    wrappedPassphrase,
  };
}

export async function verifyRecoveryCodeRecord(
  code: string,
  record: RecoveryCodeRecord,
): Promise<boolean> {
  const normalized = normalizeRecoveryCode(code);
  return verifyPassphrase(normalized, record.verifierSalt, record.verifierHash);
}

export async function unwrapPassphraseWithRecoveryCode(
  code: string,
  record: RecoveryCodeRecord,
): Promise<string> {
  const normalized = normalizeRecoveryCode(code);
  const valid = await verifyRecoveryCodeRecord(normalized, record);
  if (!valid) {
    throw new Error('Invalid recovery code.');
  }
  return decryptWithPassphrase(
    record.wrappedPassphrase as EncryptedPayload,
    normalized,
    record.wrappedPassphraseSalt,
  );
}

export async function generateRecoveryKit(passphrase: string): Promise<{
  codes: string[];
  records: RecoveryCodeRecord[];
}> {
  const codes: string[] = [];
  const records: RecoveryCodeRecord[] = [];

  while (codes.length < RECOVERY_CODE_COUNT) {
    const formatted = formatRecoveryCode(generateRawRecoveryCode());
    if (codes.includes(formatted)) {
      continue;
    }
    codes.push(formatted);
    records.push(await createRecoveryCodeRecord(formatted, passphrase));
  }

  return { codes, records };
}

export const RECOVERY_CODE_KIT_SIZE = RECOVERY_CODE_COUNT;
