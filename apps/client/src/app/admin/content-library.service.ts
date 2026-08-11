import { Injectable, signal } from '@angular/core';
import {
  CONTENT_LIBRARY_INDEX_KEY,
  type Composite,
  type ContentLibraryEntry,
  type StackProfile,
} from '@rosettadash/core';

@Injectable({ providedIn: 'root' })
export class ContentLibraryService {
  readonly entries = signal<ContentLibraryEntry[]>([]);
  readonly message = signal<string | null>(null);

  initialize(): void {
    const raw = this.getStorage()?.getItem(CONTENT_LIBRARY_INDEX_KEY);
    if (!raw) {
      this.entries.set([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as ContentLibraryEntry[];
      this.entries.set(Array.isArray(parsed) ? parsed : []);
    } catch {
      this.entries.set([]);
    }
  }

  saveComposite(input: {
    label: string;
    composite: Composite;
    stackProfile?: StackProfile | null;
  }): ContentLibraryEntry {
    const now = new Date().toISOString();
    const trimmed = input.label.trim() || input.composite.name || 'Untitled dashboard';
    const existing = this.entries().find(
      (entry) => entry.label.toLowerCase() === trimmed.toLowerCase(),
    );

    if (existing) {
      const updated: ContentLibraryEntry = {
        ...existing,
        label: trimmed,
        updatedAt: now,
        composite: structuredClone(input.composite),
        stackProfile: input.stackProfile ?? existing.stackProfile ?? null,
        formatTags: ['json'],
      };
      this.persist(this.entries().map((entry) => (entry.id === updated.id ? updated : entry)));
      this.message.set(`Updated “${trimmed}” in your content library.`);
      return updated;
    }

    const entry: ContentLibraryEntry = {
      id: crypto.randomUUID(),
      label: trimmed,
      kind: 'composite',
      createdAt: now,
      updatedAt: now,
      composite: structuredClone(input.composite),
      stackProfile: input.stackProfile ?? null,
      formatTags: ['json'],
    };
    this.persist([entry, ...this.entries()]);
    this.message.set(`Saved “${trimmed}” to your content library.`);
    return entry;
  }

  removeEntry(id: string): void {
    this.persist(this.entries().filter((entry) => entry.id !== id));
    this.message.set('Removed library entry.');
  }

  getEntry(id: string): ContentLibraryEntry | undefined {
    return this.entries().find((entry) => entry.id === id);
  }

  private persist(entries: ContentLibraryEntry[]): void {
    this.entries.set(entries);
    this.getStorage()?.setItem(CONTENT_LIBRARY_INDEX_KEY, JSON.stringify(entries));
  }

  private getStorage(): Storage | null {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  }
}
