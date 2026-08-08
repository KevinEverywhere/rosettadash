export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface ReactExportOptions {
  /** Root folder inside the export bundle (default: `src`) */
  rootDir?: string;
}

export class ReactExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReactExportError';
  }
}
