import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { BuilderAuthService } from './builder-auth.service';

export const builderAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(BuilderAuthService);
  const key = auth.getApiKey();

  let outgoing = req;
  if (key && req.url.startsWith('/api') && !req.url.startsWith('/api/auth/config')) {
    outgoing = req.clone({
      setHeaders: { 'x-dashbuilder-api-key': key },
    });
  }

  return next(outgoing).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        auth.handleUnauthorized();
      }
      return throwError(() => error);
    }),
  );
};
