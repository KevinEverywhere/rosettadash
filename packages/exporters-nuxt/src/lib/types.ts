export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface NuxtExportOptions {
  /** Root folder inside the export bundle (default: `server`) */
  rootDir?: string;
}

export class NuxtExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NuxtExportError';
  }
}

export interface RouteResource {
  routeId: string;
  resourceName: string;
  tableName: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  globalPrefix: string;
}
