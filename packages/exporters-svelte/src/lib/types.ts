export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface SvelteExportOptions {
  rootDir?: string;
}

export class SvelteExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SvelteExportError';
  }
}
