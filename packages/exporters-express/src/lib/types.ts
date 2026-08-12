export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface ExpressExportOptions {
  /** Root folder inside the export bundle (default: `server/src`) */
  rootDir?: string;
}

export class ExpressExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpressExportError';
  }
}

export interface RouteResource {
  routeId: string;
  resourceName: string;
  routerName: string;
  tableName: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  globalPrefix: string;
}
