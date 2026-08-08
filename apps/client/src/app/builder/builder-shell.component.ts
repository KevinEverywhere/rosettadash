import { Component, inject, OnInit } from '@angular/core';
import { APP_NAME } from '@dashbuilder/core';
import { BuilderProjectService } from './builder-project.service';
import { BuilderStateService } from './builder-state.service';
import { CanvasComponent } from './canvas/canvas.component';
import { InspectorComponent } from './inspector/inspector.component';
import { PaletteComponent } from './palette/palette.component';

@Component({
  selector: 'app-builder-shell',
  imports: [PaletteComponent, CanvasComponent, InspectorComponent],
  templateUrl: './builder-shell.component.html',
  styleUrl: './builder-shell.component.scss',
})
export class BuilderShellComponent implements OnInit {
  private readonly projectService = inject(BuilderProjectService);
  protected readonly state = inject(BuilderStateService);

  protected readonly appName = APP_NAME;

  ngOnInit(): void {
    void this.projectService.initialize();
  }

  protected save(): void {
    void this.projectService.save();
  }

  protected statusLabel(): string {
    if (this.state.loading()) {
      return 'Loading…';
    }
    if (this.state.saveStatus() === 'saving') {
      return 'Saving…';
    }
    if (this.state.saveStatus() === 'saved') {
      return 'Saved';
    }
    if (this.state.dirty()) {
      return 'Unsaved changes';
    }
    return 'Ready';
  }
}
