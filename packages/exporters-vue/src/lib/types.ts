export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface VueExportOptions {
  rootDir?: string;
}

export class VueExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VueExportError';
  }
}
