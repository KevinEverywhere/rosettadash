export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface NextExportOptions {
  /** Root folder inside the export bundle (default: `server/src`) */
  rootDir?: string;
}

export class NextExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NextExportError';
  }
}

export interface RouteResource {
  routeId: string;
  resourceName: string;
  tableName: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  globalPrefix: string;
}
