import { Component } from '@angular/core';
import { APP_NAME } from '@dashbuilder/core';
import { CanvasComponent } from './canvas/canvas.component';
import { InspectorComponent } from './inspector/inspector.component';
import { PaletteComponent } from './palette/palette.component';

@Component({
  selector: 'app-builder-shell',
  imports: [PaletteComponent, CanvasComponent, InspectorComponent],
  templateUrl: './builder-shell.component.html',
  styleUrl: './builder-shell.component.scss',
})
export class BuilderShellComponent {
  protected readonly appName = APP_NAME;
}
