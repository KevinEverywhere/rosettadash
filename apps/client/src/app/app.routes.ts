import { Route } from '@angular/router';
import { AdminPageComponent } from './admin/admin-page.component';
import { BuilderShellComponent } from './builder/builder-shell.component';
import { EnvironmentConfigPageComponent } from './environment/environment-config-page.component';
import { WelcomePageComponent } from './welcome/welcome-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: WelcomePageComponent,
  },
  {
    path: 'environment',
    component: EnvironmentConfigPageComponent,
  },
  {
    path: 'admin',
    component: AdminPageComponent,
  },
  {
    path: 'builder',
    component: BuilderShellComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
