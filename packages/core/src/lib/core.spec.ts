import { APP_NAME, APP_VERSION } from './constants';
import { createHealthResponse } from './health';

describe('core', () => {
  it('exposes app constants', () => {
    expect(APP_NAME).toBe('DashBuilder');
    expect(APP_VERSION).toBe('0.0.1');
  });

  it('creates a health response', () => {
    const health = createHealthResponse(APP_NAME, APP_VERSION);

    expect(health.status).toBe('ok');
    expect(health.app).toBe('DashBuilder');
    expect(health.version).toBe('0.0.1');
    expect(health.timestamp).toBeTruthy();
  });
});
