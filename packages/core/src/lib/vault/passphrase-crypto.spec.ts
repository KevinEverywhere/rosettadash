import {
  createPassphraseVerifier,
  decryptWithPassphrase,
  encryptWithPassphrase,
  verifyPassphrase,
} from './passphrase-crypto';

describe('passphrase-crypto', () => {
  it('creates a verifier that accepts the correct passphrase', async () => {
    const created = await createPassphraseVerifier('correct-horse-battery');
    await expect(
      verifyPassphrase('correct-horse-battery', created.verifierSalt, created.verifierHash),
    ).resolves.toBe(true);
    await expect(
      verifyPassphrase('wrong-passphrase', created.verifierSalt, created.verifierHash),
    ).resolves.toBe(false);
  });

  it('round-trips encrypted payloads with the passphrase', async () => {
    const created = await createPassphraseVerifier('vault-password');
    const secret = JSON.stringify({ OPENAI_API_KEY: 'sk-test' });
    const encrypted = await encryptWithPassphrase(
      secret,
      'vault-password',
      created.encryptionSalt,
    );
    const decrypted = await decryptWithPassphrase(
      encrypted,
      'vault-password',
      created.encryptionSalt,
    );
    expect(decrypted).toBe(secret);
  });

  it('rejects decryption with the wrong passphrase', async () => {
    const created = await createPassphraseVerifier('vault-password');
    const encrypted = await encryptWithPassphrase('hello', 'vault-password', created.encryptionSalt);
    await expect(
      decryptWithPassphrase(encrypted, 'other-password', created.encryptionSalt),
    ).rejects.toThrow();
  });
});
