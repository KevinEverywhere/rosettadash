import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BuilderAuthService } from './builder-auth.service';
import { builderAuthInterceptor } from './builder-auth.interceptor';

describe('BuilderAuthService', () => {
  let service: BuilderAuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([builderAuthInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(BuilderAuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('marks the session authenticated when auth is disabled', async () => {
    const initPromise = service.initialize();
    const configRequest = httpMock.expectOne('/api/auth/config');
    configRequest.flush({ enabled: false });
    await initPromise;

    expect(service.authEnabled()).toBe(false);
    expect(service.authenticated()).toBe(true);
  });

  it('stores a valid API key after login', async () => {
    const loginPromise = service.login('secret-key');
    const loginRequest = httpMock.expectOne('/api/auth/login');
    expect(loginRequest.request.body).toEqual({ apiKey: 'secret-key' });
    loginRequest.flush({ ok: true });
    await loginPromise;

    expect(service.authenticated()).toBe(true);
    expect(sessionStorage.getItem('rosettadash:apiKey')).toBe('secret-key');
  });

  it('requires login when auth is enabled and no key is stored', async () => {
    const initPromise = service.initialize();
    httpMock.expectOne('/api/auth/config').flush({ enabled: true });
    await initPromise;

    expect(service.authEnabled()).toBe(true);
    expect(service.authenticated()).toBe(false);
  });
});
