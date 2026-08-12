export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface NestExportOptions {
  /** Root folder inside the export bundle (default: `server/src`) */
  rootDir?: string;
}

export class NestExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NestExportError';
  }
}

export interface RouteResource {
  routeId: string;
  resourceName: string;
  controllerName: string;
  moduleName: string;
  tableName: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  globalPrefix: string;
}
