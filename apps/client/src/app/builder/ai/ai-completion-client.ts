import type { AiProviderId } from '@rosettadash/core';

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionRequest {
  providerId: AiProviderId;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  azureResourceName?: string;
  azureDeploymentId?: string;
  messages: AiChatMessage[];
}

export interface AiCompletionClient {
  complete(request: AiCompletionRequest): Promise<string>;
}

export class FetchAiCompletionClient implements AiCompletionClient {
  async complete(request: AiCompletionRequest): Promise<string> {
    if (request.providerId === 'ollama') {
      return this.completeOllama(request);
    }
    if (request.providerId === 'openai') {
      return this.completeOpenAi(request);
    }
    if (request.providerId === 'anthropic') {
      return this.completeAnthropic(request);
    }
    throw new Error(`Provider ${request.providerId} is not supported in AI assist yet.`);
  }

  private async completeOllama(request: AiCompletionRequest): Promise<string> {
    const baseUrl = (request.baseUrl ?? 'http://localhost:11434').replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama responded with ${response.status}.`);
    }

    const payload = (await response.json()) as { message?: { content?: string } };
    const content = payload.message?.content?.trim();
    if (!content) {
      throw new Error('Ollama returned an empty response.');
    }
    return content;
  }

  private async completeOpenAi(request: AiCompletionRequest): Promise<string> {
    const baseUrl = (request.baseUrl ?? 'https://api.openai.com/v1').replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${request.apiKey ?? ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI responded with ${response.status}.`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('OpenAI returned an empty response.');
    }
    return content;
  }

  private async completeAnthropic(request: AiCompletionRequest): Promise<string> {
    const baseUrl = (request.baseUrl ?? 'https://api.anthropic.com/v1').replace(/\/$/, '');
    const system = request.messages.find((message) => message.role === 'system')?.content ?? '';
    const conversation = request.messages.filter((message) => message.role !== 'system');

    const response = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': request.apiKey ?? '',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: 4096,
        system: `${system}\n\nRespond with JSON only.`,
        messages: conversation.map((message) => ({
          role: message.role === 'assistant' ? 'assistant' : 'user',
          content: message.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic responded with ${response.status}.`);
    }

    const payload = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const content = payload.content?.find((entry) => entry.type === 'text')?.text?.trim();
    if (!content) {
      throw new Error('Anthropic returned an empty response.');
    }
    return content;
  }
}

export class MockAiCompletionClient implements AiCompletionClient {
  constructor(private readonly responseText: string) {}

  async complete(_request: AiCompletionRequest): Promise<string> {
    return this.responseText;
  }
}
