import {
  createRecoveryCodeRecord,
  formatRecoveryCode,
  generateRecoveryKit,
  normalizeRecoveryCode,
  unwrapPassphraseWithRecoveryCode,
  verifyRecoveryCodeRecord,
} from './recovery-codes';

describe('recovery-codes', () => {
  it('normalizes and formats recovery codes', () => {
    expect(normalizeRecoveryCode('abcd-efgh-ijkl')).toBe('ABCDEFGHIJKL');
    expect(formatRecoveryCode('abcdefghijkl')).toBe('ABCD-EFGH-IJKL');
  });

  it('creates a record that unwraps the original passphrase', async () => {
    const code = 'ABCD-EFGH-IJKL';
    const record = await createRecoveryCodeRecord(code, 'vault-password');
    await expect(verifyRecoveryCodeRecord(code, record)).resolves.toBe(true);
    await expect(verifyRecoveryCodeRecord('WXYZ-1234-5678', record)).resolves.toBe(false);
    await expect(unwrapPassphraseWithRecoveryCode(code, record)).resolves.toBe('vault-password');
  });

  it('generates a unique recovery kit', async () => {
    const kit = await generateRecoveryKit('vault-password');
    expect(kit.codes).toHaveLength(8);
    expect(new Set(kit.codes).size).toBe(8);
    await expect(unwrapPassphraseWithRecoveryCode(kit.codes[0], kit.records[0])).resolves.toBe(
      'vault-password',
    );
  });
});
