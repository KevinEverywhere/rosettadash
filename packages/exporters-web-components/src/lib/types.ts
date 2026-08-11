export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface WebComponentsExportOptions {
  rootDir?: string;
}

export class WebComponentsExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebComponentsExportError';
  }
}
