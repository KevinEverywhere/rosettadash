export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface MysqlExportOptions {
  /** Root folder inside the export bundle (default: `database/src`) */
  rootDir?: string;
}

export class MysqlExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MysqlExportError';
  }
}

export interface TableResource {
  routeId: string;
  resourceName: string;
  tableName: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
}
