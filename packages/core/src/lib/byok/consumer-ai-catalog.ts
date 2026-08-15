import { AI_PROVIDER_MANIFEST } from './provider-manifest';
import type { AiProviderId } from './types';
import type { EnvFieldDefinition } from './types';

function providerBaseUrlEnvKey(providerId: AiProviderId): string {
  return `${providerId.toUpperCase().replace(/-/g, '_')}_BASE_URL`;
}

export function buildConsumerAiFields(): EnvFieldDefinition[] {
  const fields: EnvFieldDefinition[] = [];

  for (const provider of AI_PROVIDER_MANIFEST) {
    if (provider.requiresApiKey) {
      fields.push({
        id: `consumer-ai-${provider.id}-key`,
        envKey: provider.apiKeyEnvKey,
        label: `${provider.label} API key`,
        description: `${provider.description} End-user BYOK for Scout and other premium AI features.`,
        category: 'ai',
        sensitive: true,
        aiProviderId: provider.id,
        placeholder: provider.id === 'openai' ? 'sk-…' : undefined,
      });
    }

    if (provider.supportsCustomBaseUrl) {
      fields.push({
        id: `consumer-ai-${provider.id}-base-url`,
        envKey: providerBaseUrlEnvKey(provider.id),
        label: `${provider.label} base URL`,
        description: 'Override for proxies, Azure, or local Ollama.',
        category: 'ai',
        sensitive: false,
        placeholder: provider.defaultBaseUrl,
        aiProviderId: provider.id,
        optional: true,
      });
    }
  }

  fields.push({
    id: 'consumer-ai-azure-resource',
    envKey: 'AZURE_OPENAI_RESOURCE_NAME',
    label: 'Azure OpenAI resource name',
    description: 'Azure resource name for deployment URL construction.',
    category: 'ai',
    sensitive: false,
    aiProviderId: 'azure-openai',
    optional: true,
  });

  fields.push({
    id: 'consumer-ai-azure-deployment',
    envKey: 'AZURE_OPENAI_DEPLOYMENT_ID',
    label: 'Azure OpenAI deployment ID',
    description: 'Deployment id for chat completions.',
    category: 'ai',
    sensitive: false,
    aiProviderId: 'azure-openai',
    optional: true,
  });

  return fields;
}

export const CONSUMER_AI_FIELDS: EnvFieldDefinition[] = buildConsumerAiFields();

export function consumerAiKeyEnvKeys(): string[] {
  return AI_PROVIDER_MANIFEST.filter((provider) => provider.requiresApiKey).map(
    (provider) => provider.apiKeyEnvKey,
  );
}

export function scoutAiProviderReady(
  hasSecret: (envKey: string) => boolean,
  resolveSecret: (envKey: string) => string,
): boolean {
  for (const provider of AI_PROVIDER_MANIFEST) {
    if (!provider.requiresApiKey) {
      return true;
    }
    if (resolveSecret(provider.apiKeyEnvKey) || hasSecret(provider.apiKeyEnvKey)) {
      return true;
    }
  }
  return false;
}
