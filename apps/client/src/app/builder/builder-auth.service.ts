import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API_KEY_STORAGE = 'rosettadash:apiKey';

@Injectable({ providedIn: 'root' })
export class BuilderAuthService {
  private readonly http = inject(HttpClient);

  readonly authEnabled = signal(false);
  readonly authenticated = signal(false);
  readonly checking = signal(true);
  readonly loginError = signal<string | null>(null);

  async initialize(): Promise<void> {
    this.checking.set(true);
    this.loginError.set(null);

    try {
      const config = await firstValueFrom(
        this.http.get<{ enabled: boolean }>('/api/auth/config'),
      );
      this.authEnabled.set(config.enabled);
      if (!config.enabled) {
        this.authenticated.set(true);
        return;
      }
      this.authenticated.set(!!this.readStoredKey());
    } catch {
      this.authEnabled.set(false);
      this.authenticated.set(true);
    } finally {
      this.checking.set(false);
    }
  }

  getApiKey(): string | null {
    return this.readStoredKey();
  }

  async login(apiKey: string): Promise<boolean> {
    this.loginError.set(null);

    try {
      await firstValueFrom(
        this.http.post<{ ok: boolean }>('/api/auth/login', { apiKey }),
      );
      sessionStorage.setItem(API_KEY_STORAGE, apiKey);
      this.authenticated.set(true);
      return true;
    } catch {
      this.loginError.set('Invalid API key');
      this.authenticated.set(false);
      return false;
    }
  }

  handleUnauthorized(): void {
    if (!this.authEnabled()) {
      return;
    }
    sessionStorage.removeItem(API_KEY_STORAGE);
    this.authenticated.set(false);
  }

  private readStoredKey(): string | null {
    return sessionStorage.getItem(API_KEY_STORAGE);
  }
}
