import type { StackDatabaseChoice, StackServerChoice } from '../model/types';

export type EnvConfigCategory = 'builder' | 'database' | 'server' | 'ai' | 'auth' | 'integration' | 'custom';

export type AiProviderId = 'openai' | 'anthropic' | 'google' | 'azure-openai' | 'ollama';

export interface EnvFieldDefinition {
  id: string;
  envKey: string;
  label: string;
  description: string;
  category: EnvConfigCategory;
  sensitive: boolean;
  placeholder?: string;
  showWhen?: {
    database?: StackDatabaseChoice | StackDatabaseChoice[];
    server?: StackServerChoice | StackServerChoice[];
  };
  aiProviderId?: AiProviderId;
  optional?: boolean;
}

export interface AiProviderDefinition {
  id: AiProviderId;
  label: string;
  description: string;
  requiresApiKey: boolean;
  defaultBaseUrl?: string;
  apiKeyEnvKey: string;
  models: Array<{ id: string; label: string }>;
  supportsCustomBaseUrl: boolean;
}

export interface ByokSettings {
  /** Default provider when AI assist runs (Phase 20). Other provider keys may also be stored. */
  activeProvider: AiProviderId;
  activeModel: string;
  rememberKeys: boolean;
  customBaseUrl?: string;
  azureResourceName?: string;
  azureDeploymentId?: string;
  /** Per-provider model preference when switching between stored keys. */
  providerModels?: Partial<Record<AiProviderId, string>>;
}

export interface EnvironmentStorageSettings {
  rememberKeys: boolean;
  byok: ByokSettings;
  validation?: CredentialValidationMap;
}

export interface EnvironmentValues {
  /** Plain env key → value map (never sent to RosettaDash server). */
  values: Record<string, string>;
}

export type ConnectionTestStatus = 'idle' | 'testing' | 'success' | 'error';

export interface ConnectionTestResult {
  status: ConnectionTestStatus;
  message: string;
}

/** Whether a stored credential has been checked in this browser session. */
export type CredentialValidationStatus = 'unknown' | 'valid' | 'invalid';

export interface CredentialValidationRecord {
  status: CredentialValidationStatus;
  message?: string;
  checkedAt?: string;
}

export type CredentialValidationMap = Record<string, CredentialValidationRecord>;

export function validationKeyForAiProvider(providerId: AiProviderId): string {
  return `ai:${providerId}`;
}

export function validationKeyForEnvField(envKey: string): string {
  return `env:${envKey}`;
}
