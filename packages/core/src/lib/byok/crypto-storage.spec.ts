import {
  decryptSecretPayload,
  encryptSecretPayload,
  generateStorageSalt,
  parseEncryptedPayload,
  serializeEncryptedPayload,
} from './crypto-storage';

describe('crypto-storage', () => {
  const salt = generateStorageSalt();

  it('round-trips encrypted payloads', async () => {
    const secret = JSON.stringify({ OPENAI_API_KEY: 'sk-test-123', DATABASE_URL: 'postgres://' });
    const encrypted = await encryptSecretPayload(secret, salt);
    const serialized = serializeEncryptedPayload(encrypted);
    const restored = parseEncryptedPayload(serialized);
    const decrypted = await decryptSecretPayload(restored, salt);
    expect(decrypted).toBe(secret);
  });

  it('rejects mismatched salt', async () => {
    const encrypted = await encryptSecretPayload('hello', salt);
    const otherSalt = generateStorageSalt();
    await expect(decryptSecretPayload(encrypted, otherSalt)).rejects.toThrow();
  });
});
