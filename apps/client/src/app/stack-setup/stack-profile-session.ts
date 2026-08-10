import type { StackProfile } from '@dashbuilder/core';

export const BUILDER_SESSION_KEY = 'dashbuilder:session';
export const PENDING_STACK_KEY = 'dashbuilder:pending-stack';

export function readPendingStackProfile(): StackProfile | null {
  const raw = sessionStorage.getItem(PENDING_STACK_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StackProfile;
  } catch {
    return null;
  }
}

export function writePendingStackProfile(profile: StackProfile): void {
  sessionStorage.setItem(PENDING_STACK_KEY, JSON.stringify(profile));
}

export function clearPendingStackProfile(): void {
  sessionStorage.removeItem(PENDING_STACK_KEY);
}

export function hasBuilderSession(): boolean {
  return !!sessionStorage.getItem(BUILDER_SESSION_KEY);
}
