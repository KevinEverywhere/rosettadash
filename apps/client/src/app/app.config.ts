import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { builderAuthInterceptor } from './builder/builder-auth.interceptor';
import {
  ComponentPreviewAdapterRegistry,
  registerDefaultComponentPreviewAdapters,
} from './builder/preview/component-preview-adapter.registry';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([builderAuthInterceptor])),
    provideRouter(appRoutes),
    provideAppInitializer(() => {
      registerDefaultComponentPreviewAdapters(inject(ComponentPreviewAdapterRegistry));
    }),
  ],
};
