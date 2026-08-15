import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'overview', component: AppComponent },
  { path: 'destinations', component: AppComponent },
  { path: 'maps', component: AppComponent },
  { path: 'maps/globe', component: AppComponent },
  { path: 'media', component: AppComponent },
  { path: 'authoring', component: AppComponent },
  { path: 'intel', component: AppComponent },
  { path: 'plan', component: AppComponent },
  { path: 'views', component: AppComponent },
  { path: 'stack', component: AppComponent },
  { path: 'settings', component: AppComponent },
  { path: 'map', component: AppComponent },
  { path: 'globe', component: AppComponent },
  { path: 'scout', component: AppComponent },
  { path: '**', component: AppComponent },
];
