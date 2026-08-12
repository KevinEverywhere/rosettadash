import { AI_PROVIDER_MANIFEST } from './provider-manifest';
import type { AiProviderId } from './types';
import { validationKeyForAiProvider, validationKeyForEnvField } from './types';

export function findAiProviderByEnvKey(envKey: string) {
  return AI_PROVIDER_MANIFEST.find((provider) => provider.apiKeyEnvKey === envKey);
}

export function aiProviderIdForEnvKey(envKey: string): AiProviderId | null {
  return findAiProviderByEnvKey(envKey)?.id ?? null;
}

export function resolveValidationKeysForEnvKey(envKey: string): string[] {
  const keys = [validationKeyForEnvField(envKey)];
  const providerId = aiProviderIdForEnvKey(envKey);
  if (providerId) {
    keys.push(validationKeyForAiProvider(providerId));
  }
  return keys;
}

export function summarizeAiValidation(
  validation: Record<string, { status: string }>,
  configuredProviderIds: AiProviderId[],
): string | null {
  if (!configuredProviderIds.length) {
    return null;
  }

  let valid = 0;
  let invalid = 0;
  for (const providerId of configuredProviderIds) {
    const status = validation[validationKeyForAiProvider(providerId)]?.status;
    if (status === 'valid') {
      valid += 1;
    } else if (status === 'invalid') {
      invalid += 1;
    }
  }

  if (invalid) {
    return `${invalid} failed`;
  }
  if (valid === configuredProviderIds.length) {
    return `${valid} validated`;
  }
  if (valid) {
    return `${valid} validated · ${configuredProviderIds.length - valid} unchecked`;
  }
  return `${configuredProviderIds.length} unchecked`;
}
