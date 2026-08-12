export interface HealthResponse {
  status: 'ok';
  app: string;
  version: string;
  timestamp: string;
}

export function createHealthResponse(app: string, version: string): HealthResponse {
  return {
    status: 'ok',
    app,
    version,
    timestamp: new Date().toISOString(),
  };
}
