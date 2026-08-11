export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface WebComponentsExportOptions {
  rootDir?: string;
  /** `package` imports @dashbuilder/web-components runtime; `standalone` inlines source (default: package). */
  exportMode?: 'standalone' | 'package';
}

export class WebComponentsExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebComponentsExportError';
  }
}
