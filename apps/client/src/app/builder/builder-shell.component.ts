import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_NAME, listCompositeTemplates } from '@dashbuilder/core';
import { BuilderProjectService } from './builder-project.service';
import { BuilderStateService, WorkspaceMode } from './builder-state.service';
import { CanvasComponent } from './canvas/canvas.component';
import { ExportWizardComponent } from './export/export-wizard.component';
import { InspectorComponent } from './inspector/inspector.component';
import { PaletteComponent } from './palette/palette.component';
import { PreviewPanelComponent } from './preview/preview-panel.component';

@Component({
  selector: 'app-builder-shell',
  imports: [
    PaletteComponent,
    CanvasComponent,
    PreviewPanelComponent,
    InspectorComponent,
    ExportWizardComponent,
    FormsModule,
  ],
  templateUrl: './builder-shell.component.html',
  styleUrl: './builder-shell.component.scss',
})
export class BuilderShellComponent implements OnInit {
  private readonly projectService = inject(BuilderProjectService);
  protected readonly state = inject(BuilderStateService);

  protected readonly appName = APP_NAME;
  protected readonly exportWizardOpen = signal(false);
  protected readonly compositeTemplates = listCompositeTemplates();
  protected selectedTemplateId = '';

  ngOnInit(): void {
    void this.projectService.initialize();
  }

  protected save(): void {
    void this.projectService.save();
  }

  protected applySelectedTemplate(): void {
    if (!this.selectedTemplateId) {
      return;
    }
    this.state.applyCompositeTemplate(this.selectedTemplateId);
    this.selectedTemplateId = '';
  }

  protected setWorkspaceMode(mode: WorkspaceMode): void {
    this.state.setWorkspaceMode(mode);
  }

  protected openExportWizard(): void {
    this.exportWizardOpen.set(true);
  }

  protected closeExportWizard(): void {
    this.exportWizardOpen.set(false);
  }

  protected undo(): void {
    this.state.undo();
  }

  protected redo(): void {
    this.state.redo();
  }

  @HostListener('document:keydown', ['$event'])
  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (this.state.loading() || this.exportWizardOpen()) {
      return;
    }

    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }

    const mod = event.metaKey || event.ctrlKey;
    if (!mod) {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.undo();
      return;
    }

    if (key === 'z' && event.shiftKey) {
      event.preventDefault();
      this.redo();
      return;
    }

    if (key === 'y') {
      event.preventDefault();
      this.redo();
    }
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
