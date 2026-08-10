import type { ByokSettings } from './types';
import type { AiProviderDefinition, AiProviderId } from './types';

export const AI_PROVIDER_MANIFEST: AiProviderDefinition[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    description: 'Chat Completions and Responses API',
    requiresApiKey: true,
    apiKeyEnvKey: 'OPENAI_API_KEY',
    supportsCustomBaseUrl: true,
    defaultBaseUrl: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini' },
      { id: 'gpt-4.1', label: 'GPT-4.1' },
    ],
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    description: 'Claude Messages API',
    requiresApiKey: true,
    apiKeyEnvKey: 'ANTHROPIC_API_KEY',
    supportsCustomBaseUrl: true,
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    models: [
      { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
      { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
    ],
  },
  {
    id: 'google',
    label: 'Google Gemini',
    description: 'Google AI Studio / Gemini API',
    requiresApiKey: true,
    apiKeyEnvKey: 'GOOGLE_AI_API_KEY',
    supportsCustomBaseUrl: true,
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    ],
  },
  {
    id: 'azure-openai',
    label: 'Azure OpenAI',
    description: 'Azure-hosted OpenAI deployment',
    requiresApiKey: true,
    apiKeyEnvKey: 'AZURE_OPENAI_API_KEY',
    supportsCustomBaseUrl: true,
    models: [
      { id: 'gpt-4o', label: 'GPT-4o (deployment)' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini (deployment)' },
    ],
  },
  {
    id: 'ollama',
    label: 'Ollama (local)',
    description: 'Local HTTP inference — no API key required',
    requiresApiKey: false,
    apiKeyEnvKey: 'OLLAMA_API_KEY',
    supportsCustomBaseUrl: true,
    defaultBaseUrl: 'http://localhost:11434',
    models: [
      { id: 'llama3.2', label: 'Llama 3.2' },
      { id: 'mistral', label: 'Mistral' },
    ],
  },
];

export function getAiProvider(id: AiProviderId): AiProviderDefinition {
  const provider = AI_PROVIDER_MANIFEST.find((entry) => entry.id === id);
  if (!provider) {
    throw new Error(`Unknown AI provider: ${id}`);
  }
  return provider;
}

export function getDefaultByokSettings(): ByokSettings {
  const defaultProvider = AI_PROVIDER_MANIFEST[0];
  return {
    activeProvider: defaultProvider.id,
    activeModel: defaultProvider.models[0]?.id ?? '',
    rememberKeys: false,
  };
}
