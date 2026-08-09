export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface SupabaseExportOptions {
  /** Root folder inside the export bundle (default: `database/src`) */
  rootDir?: string;
}

export class SupabaseExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SupabaseExportError';
  }
}

export interface TableResource {
  routeId: string;
  resourceName: string;
  tableName: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
}
