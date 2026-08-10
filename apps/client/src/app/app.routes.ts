import { Route } from '@angular/router';
import { BuilderShellComponent } from './builder/builder-shell.component';
import { StackSetupComponent } from './stack-setup/stack-setup.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: StackSetupComponent,
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
