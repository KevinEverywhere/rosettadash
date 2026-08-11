import type { Composite, StackProfile } from '../model/types';

export type ContentLibraryKind = 'composite' | 'export' | 'draft';

export type ContentFormatTag =
  | 'js'
  | 'jsx'
  | 'ts'
  | 'tsx'
  | 'svg'
  | 'xml'
  | 'html'
  | 'css'
  | 'json'
  | 'md'
  | 'env'
  | 'other';

export interface ContentLibraryFile {
  relativePath: string;
  format: ContentFormatTag;
  bytes?: number;
}

export interface ContentLibraryEntry {
  id: string;
  label: string;
  kind: ContentLibraryKind;
  createdAt: string;
  updatedAt: string;
  composite: Composite;
  stackProfile?: StackProfile | null;
  storage?: {
    rootDirectory?: string;
    files?: ContentLibraryFile[];
  };
  formatTags?: ContentFormatTag[];
}

export const CONTENT_LIBRARY_INDEX_KEY = 'dashbuilder:content-library:index';

export interface AdminFeatureFlags {
  aiDrawerEnabled: boolean;
  voiceInputEnabled: boolean;
}

export const ADMIN_FEATURE_FLAGS_KEY = 'dashbuilder:admin:feature-flags';

export const DEFAULT_ADMIN_FEATURE_FLAGS: AdminFeatureFlags = {
  aiDrawerEnabled: true,
  voiceInputEnabled: true,
};
