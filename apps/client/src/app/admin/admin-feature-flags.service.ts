import { Injectable, signal } from '@angular/core';
import {
  ADMIN_FEATURE_FLAGS_KEY,
  DEFAULT_ADMIN_FEATURE_FLAGS,
  type AdminFeatureFlags,
} from '@rosettadash/core';

@Injectable({ providedIn: 'root' })
export class AdminFeatureFlagsService {
  readonly flags = signal<AdminFeatureFlags>(DEFAULT_ADMIN_FEATURE_FLAGS);

  initialize(): void {
    const raw = this.getStorage()?.getItem(ADMIN_FEATURE_FLAGS_KEY);
    if (!raw) {
      this.flags.set(DEFAULT_ADMIN_FEATURE_FLAGS);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<AdminFeatureFlags>;
      this.flags.set({ ...DEFAULT_ADMIN_FEATURE_FLAGS, ...parsed });
    } catch {
      this.flags.set(DEFAULT_ADMIN_FEATURE_FLAGS);
    }
  }

  update(partial: Partial<AdminFeatureFlags>): void {
    const next = { ...this.flags(), ...partial };
    this.flags.set(next);
    this.getStorage()?.setItem(ADMIN_FEATURE_FLAGS_KEY, JSON.stringify(next));
  }

  isAiDrawerEnabled(): boolean {
    return this.flags().aiDrawerEnabled;
  }

  isVoiceInputEnabled(): boolean {
    return this.flags().voiceInputEnabled;
  }

  private getStorage(): Storage | null {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  }
}
