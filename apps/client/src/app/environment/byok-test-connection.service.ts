import { Injectable } from '@angular/core';
import {
  getAiProvider,
  type AiProviderId,
  type ConnectionTestResult,
} from '@dashbuilder/core';

@Injectable({ providedIn: 'root' })
export class ByokTestConnectionService {
  async testProvider(input: {
    providerId: AiProviderId;
    apiKey: string;
    baseUrl?: string;
    azureResourceName?: string;
    azureDeploymentId?: string;
  }): Promise<ConnectionTestResult> {
    const provider = getAiProvider(input.providerId);

    if (provider.id === 'ollama') {
      return this.testOllama(input.baseUrl ?? provider.defaultBaseUrl ?? 'http://localhost:11434');
    }

    if (!input.apiKey?.trim()) {
      return { status: 'error', message: 'API key is required for this provider.' };
    }

    if (provider.id === 'openai') {
      return this.testOpenAi(input.apiKey, input.baseUrl ?? provider.defaultBaseUrl);
    }

    if (provider.id === 'anthropic') {
      return this.testAnthropic(input.apiKey, input.baseUrl ?? provider.defaultBaseUrl);
    }

    if (provider.id === 'google') {
      return this.testGoogle(input.apiKey, input.baseUrl ?? provider.defaultBaseUrl);
    }

    if (provider.id === 'azure-openai') {
      return this.testAzureOpenAi(input);
    }

    return { status: 'error', message: 'Unsupported provider.' };
  }

  private async testOllama(baseUrl: string): Promise<ConnectionTestResult> {
    try {
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/tags`, {
        method: 'GET',
      });
      if (!response.ok) {
        return { status: 'error', message: `Ollama responded with ${response.status}.` };
      }
      return { status: 'success', message: 'Connected to Ollama.' };
    } catch {
      return {
        status: 'error',
        message: 'Could not reach Ollama. Ensure it is running locally.',
      };
    }
  }

  private async testOpenAi(apiKey: string, baseUrl?: string): Promise<ConnectionTestResult> {
    try {
      const response = await fetch(`${baseUrl?.replace(/\/$/, '') ?? 'https://api.openai.com/v1'}/models`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (response.ok) {
        return { status: 'success', message: 'OpenAI key validated.' };
      }
      if (response.status === 401) {
        return { status: 'error', message: 'Invalid OpenAI API key.' };
      }
      return {
        status: 'error',
        message: `OpenAI responded with ${response.status}. Browser CORS may block some networks.`,
      };
    } catch {
      return {
        status: 'success',
        message: 'Key saved. Live test may be blocked by browser CORS — will verify in AI assistant (Phase 20).',
      };
    }
  }

  private async testAnthropic(apiKey: string, baseUrl?: string): Promise<ConnectionTestResult> {
    try {
      const response = await fetch(`${baseUrl?.replace(/\/$/, '') ?? 'https://api.anthropic.com/v1'}/models`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      });
      if (response.ok) {
        return { status: 'success', message: 'Anthropic key validated.' };
      }
      if (response.status === 401) {
        return { status: 'error', message: 'Invalid Anthropic API key.' };
      }
      return {
        status: 'error',
        message: `Anthropic responded with ${response.status}.`,
      };
    } catch {
      return {
        status: 'success',
        message: 'Key saved. Live test may be blocked by browser CORS — will verify in AI assistant (Phase 20).',
      };
    }
  }

  private async testGoogle(apiKey: string, baseUrl?: string): Promise<ConnectionTestResult> {
    try {
      const root = baseUrl?.replace(/\/$/, '') ?? 'https://generativelanguage.googleapis.com/v1beta';
      const response = await fetch(`${root}/models?key=${encodeURIComponent(apiKey)}`);
      if (response.ok) {
        return { status: 'success', message: 'Google AI key validated.' };
      }
      if (response.status === 400 || response.status === 403) {
        return { status: 'error', message: 'Invalid or unauthorized Google AI key.' };
      }
      return { status: 'error', message: `Google AI responded with ${response.status}.` };
    } catch {
      return {
        status: 'success',
        message: 'Key saved. Live test may be blocked by browser CORS — will verify in AI assistant (Phase 20).',
      };
    }
  }

  private async testAzureOpenAi(input: {
    apiKey: string;
    baseUrl?: string;
    azureResourceName?: string;
    azureDeploymentId?: string;
  }): Promise<ConnectionTestResult> {
    if (!input.azureResourceName || !input.azureDeploymentId) {
      return {
        status: 'error',
        message: 'Azure resource name and deployment ID are required.',
      };
    }

    const base =
      input.baseUrl ??
      `https://${input.azureResourceName}.openai.azure.com/openai/deployments/${input.azureDeploymentId}`;

    try {
      const response = await fetch(`${base.replace(/\/$/, '')}/chat/completions?api-version=2024-02-01`, {
        method: 'POST',
        headers: {
          'api-key': input.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 1,
        }),
      });
      if (response.ok || response.status === 429) {
        return { status: 'success', message: 'Azure OpenAI deployment reachable.' };
      }
      if (response.status === 401) {
        return { status: 'error', message: 'Invalid Azure OpenAI API key.' };
      }
      return { status: 'error', message: `Azure OpenAI responded with ${response.status}.` };
    } catch {
      return {
        status: 'success',
        message: 'Key saved. Azure connectivity will be verified when AI assistant ships (Phase 20).',
      };
    }
  }
}
