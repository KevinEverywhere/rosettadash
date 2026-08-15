import { bootstrapApplication } from '@angular/platform-browser';
import { registerRosettaDashElements } from '@rosettadash/web-components';
import '@rosettadash/web-components/styles.css';
import '../public/styles.css';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

registerRosettaDashElements();

bootstrapApplication(AppComponent, appConfig).catch((error) => {
  console.error(error);
});
