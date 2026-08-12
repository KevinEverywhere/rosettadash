export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface MongoExportOptions {
  /** Root folder inside the export bundle (default: `database/src`) */
  rootDir?: string;
}

export class MongoExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MongoExportError';
  }
}

export interface CollectionResource {
  routeId: string;
  resourceName: string;
  collectionName: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
}
