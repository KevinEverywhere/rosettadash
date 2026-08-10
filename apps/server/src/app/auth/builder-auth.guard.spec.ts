import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { BuilderAuthGuard } from './builder-auth.guard';

function createContext(path: string, headers: Record<string, string> = {}): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        path,
        url: path,
        headers,
      }),
    }),
  } as ExecutionContext;
}

describe('BuilderAuthGuard', () => {
  const guard = new BuilderAuthGuard();
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('allows all routes when auth is disabled', () => {
    delete process.env['BUILDER_AUTH_ENABLED'];
    expect(guard.canActivate(createContext('/api/projects'))).toBe(true);
  });

  it('allows public health and auth routes when auth is enabled', () => {
    process.env['BUILDER_AUTH_ENABLED'] = 'true';
    process.env['BUILDER_API_KEY'] = 'secret';

    expect(guard.canActivate(createContext('/api/health'))).toBe(true);
    expect(guard.canActivate(createContext('/api/auth/config'))).toBe(true);
    expect(guard.canActivate(createContext('/api/auth/login'))).toBe(true);
  });

  it('rejects protected routes without a key when auth is enabled', () => {
    process.env['BUILDER_AUTH_ENABLED'] = 'true';
    process.env['BUILDER_API_KEY'] = 'secret';

    expect(() => guard.canActivate(createContext('/api/projects'))).toThrow(
      UnauthorizedException,
    );
  });

  it('accepts bearer and header keys when auth is enabled', () => {
    process.env['BUILDER_AUTH_ENABLED'] = 'true';
    process.env['BUILDER_API_KEY'] = 'secret';

    expect(
      guard.canActivate(
        createContext('/api/projects', { authorization: 'Bearer secret' }),
      ),
    ).toBe(true);

    expect(
      guard.canActivate(
        createContext('/api/projects', { 'x-dashbuilder-api-key': 'secret' }),
      ),
    ).toBe(true);
  });

  it('rejects invalid keys when auth is enabled', () => {
    process.env['BUILDER_AUTH_ENABLED'] = 'true';
    process.env['BUILDER_API_KEY'] = 'secret';

    expect(() =>
      guard.canActivate(
        createContext('/api/projects', { 'x-dashbuilder-api-key': 'wrong' }),
      ),
    ).toThrow(UnauthorizedException);
  });
});
