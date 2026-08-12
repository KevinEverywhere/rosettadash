import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AI_PROVIDER_MANIFEST,
  findAiProviderByEnvKey,
  type EnvFieldDefinition,
} from '@rosettadash/core';
import { ByokTestConnectionService } from './byok-test-connection.service';
import { EnvironmentConfigService } from './environment-config.service';

@Injectable({ providedIn: 'root' })
export class CredentialValidationService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(EnvironmentConfigService);
  private readonly byokTest = inject(ByokTestConnectionService);

  async validateAiProvider(providerId: (typeof AI_PROVIDER_MANIFEST)[number]['id']): Promise<void> {
    const provider = AI_PROVIDER_MANIFEST.find((entry) => entry.id === providerId);
    if (!provider) {
      return;
    }

    const byok = this.config.settings().byok;
    const result = await this.byokTest.testProvider({
      providerId: provider.id,
      apiKey: this.config.getValue(provider.apiKeyEnvKey),
      baseUrl:
        provider.id === byok.activeProvider
          ? byok.customBaseUrl ||
            this.config.getValue(`${provider.id.toUpperCase().replace(/-/g, '_')}_BASE_URL`)
          : this.config.getValue(`${provider.id.toUpperCase().replace(/-/g, '_')}_BASE_URL`),
      azureResourceName: provider.id === 'azure-openai' ? byok.azureResourceName : undefined,
      azureDeploymentId: provider.id === 'azure-openai' ? byok.azureDeploymentId : undefined,
    });

    this.config.setAiProviderValidation(
      provider.id,
      result.status === 'success' ? 'valid' : 'invalid',
      result.message,
    );
  }

  async validateBuilderAccess(): Promise<void> {
    const apiKey = this.config.getValue('ROSETTADASH_API_KEY').trim();
    if (!apiKey) {
      this.config.setEnvFieldValidation('ROSETTADASH_API_KEY', 'invalid', 'API key is empty.');
      return;
    }

    try {
      const config = await firstValueFrom(this.http.get<{ enabled: boolean }>('/api/auth/config'));
      if (!config.enabled) {
        this.config.setEnvFieldValidation(
          'ROSETTADASH_API_KEY',
          'valid',
          'Builder auth is disabled — key not required.',
        );
        return;
      }

      await firstValueFrom(this.http.post<{ ok: boolean }>('/api/auth/login', { apiKey }));
      this.config.setEnvFieldValidation('ROSETTADASH_API_KEY', 'valid', 'RosettaDash access verified.');
    } catch {
      this.config.setEnvFieldValidation('ROSETTADASH_API_KEY', 'invalid', 'RosettaDash rejected this key.');
    }
  }

  validateEnvField(field: EnvFieldDefinition): void {
    const value = this.config.getValue(field.envKey).trim();
    if (!value) {
      this.config.setEnvFieldValidation(field.envKey, 'invalid', `${field.label} is empty.`);
      return;
    }

    if (field.envKey.endsWith('_URL') || field.envKey.includes('URI') || field.envKey.includes('DATABASE')) {
      try {
        const normalized = value.includes('://') ? value : `scheme://${value}`;
        new URL(normalized);
        this.config.setEnvFieldValidation(field.envKey, 'valid', 'Connection string format looks valid.');
      } catch {
        this.config.setEnvFieldValidation(field.envKey, 'invalid', 'Connection string format is invalid.');
      }
      return;
    }

    this.config.setEnvFieldValidation(field.envKey, 'valid', 'Value saved — full connectivity check deferred.');
  }

  providerHasStoredKey(providerId: (typeof AI_PROVIDER_MANIFEST)[number]['id']): boolean {
    const provider = AI_PROVIDER_MANIFEST.find((entry) => entry.id === providerId);
    if (!provider) {
      return false;
    }
    if (!provider.requiresApiKey) {
      return true;
    }
    return !!this.config.getValue(provider.apiKeyEnvKey).trim();
  }

  envKeyBelongsToProvider(envKey: string): boolean {
    return !!findAiProviderByEnvKey(envKey);
  }
}
