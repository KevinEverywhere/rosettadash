import { Route } from '@angular/router';
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
    path: 'builder',
    component: BuilderShellComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
