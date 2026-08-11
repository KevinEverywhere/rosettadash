export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface WebComponentsExportOptions {
  rootDir?: string;
  /** `standalone` inlines full source (default). `package` imports @rosettadash/web-components — opt-in, for dogfooding only. */
  exportMode?: 'standalone' | 'package';
}

export class WebComponentsExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebComponentsExportError';
  }
}
