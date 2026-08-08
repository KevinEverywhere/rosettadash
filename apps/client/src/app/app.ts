import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_NAME, APP_VERSION } from '@dashbuilder/core';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly appName = APP_NAME;
  protected readonly appVersion = APP_VERSION;
}
