import { Route } from '@angular/router';
import { BuilderShellComponent } from './builder/builder-shell.component';
import { WelcomePageComponent } from './welcome/welcome-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: WelcomePageComponent,
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
