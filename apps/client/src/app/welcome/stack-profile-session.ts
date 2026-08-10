import type { StackProfile } from '@dashbuilder/core';

export const BUILDER_SESSION_KEY = 'dashbuilder:session';
export const PENDING_STACK_KEY = 'dashbuilder:pending-stack';
export const ACTIVE_STACK_KEY = 'dashbuilder:active-stack';

export interface BuilderSession {
  projectId: string;
  compositeId: string;
}

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

export function readBuilderSession(): BuilderSession | null {
  const raw = sessionStorage.getItem(BUILDER_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as BuilderSession;
  } catch {
    return null;
  }
}

export function hasBuilderSession(): boolean {
  return readBuilderSession() !== null;
}

export function clearBuilderSession(): void {
  sessionStorage.removeItem(BUILDER_SESSION_KEY);
}

export function readActiveStackProfile(): StackProfile | null {
  const raw = sessionStorage.getItem(ACTIVE_STACK_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StackProfile;
  } catch {
    return null;
  }
}

export function writeActiveStackProfile(profile: StackProfile): void {
  sessionStorage.setItem(ACTIVE_STACK_KEY, JSON.stringify(profile));
}

export function clearActiveStackProfile(): void {
  sessionStorage.removeItem(ACTIVE_STACK_KEY);
}

export function canEnterBuilder(): boolean {
  return hasBuilderSession() || readPendingStackProfile() !== null;
}
