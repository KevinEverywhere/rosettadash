import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import type { Composite, ExportScope, ValidationIssue } from '@dashbuilder/core';
import { resolveExportComposite } from '@dashbuilder/core';
import { firstValueFrom } from 'rxjs';
import { BuilderStateService } from '../builder-state.service';
import {
  ExportApiService,
  ExportBundleResponse,
  ExportValidationErrorBody,
  GeneratedFile,
} from './export-api.service';
import { ExportZipService } from './export-zip.service';

type UiTarget = 'react' | 'angular' | 'vue' | 'svelte';
type ServerTarget = 'nest' | 'express' | 'next' | 'nuxt';
type DatabaseTarget = 'postgresql' | 'mongodb' | 'supabase' | 'mysql';

interface UiTargetOption {
  id: UiTarget;
  label: string;
  description: string;
}

interface ServerTargetOption {
  id: ServerTarget;
  label: string;
  description: string;
}

interface DatabaseTargetOption {
  id: DatabaseTarget;
  label: string;
  description: string;
}

interface ExportScopeOption {
  id: ExportScope;
  label: string;
  description: string;
}

@Component({
  selector: 'app-export-wizard',
  templateUrl: './export-wizard.component.html',
  styleUrl: './export-wizard.component.scss',
})
export class ExportWizardComponent {
  private readonly state = inject(BuilderStateService);
  private readonly exportApi = inject(ExportApiService);
  private readonly exportZip = inject(ExportZipService);

  readonly open = input(false);
  readonly closed = output<void>();

  protected readonly uiTargetOptions: UiTargetOption[] = [
    { id: 'react', label: 'React', description: 'TSX + hooks' },
    { id: 'angular', label: 'Angular', description: 'Standalone components' },
    { id: 'vue', label: 'Vue', description: 'Composition API SFCs' },
    { id: 'svelte', label: 'Svelte', description: 'Svelte 5 runes + SFCs' },
  ];

  protected readonly serverTargetOptions: ServerTargetOption[] = [
    { id: 'nest', label: 'NestJS', description: 'Modules + controllers' },
    { id: 'express', label: 'Express', description: 'Routers + middleware' },
    { id: 'next', label: 'Next.js', description: 'App Router API routes' },
    { id: 'nuxt', label: 'Nuxt', description: 'Nitro server routes' },
  ];

  protected readonly databaseTargetOptions: DatabaseTargetOption[] = [
    { id: 'postgresql', label: 'PostgreSQL', description: 'SQL via server exporter' },
    { id: 'mongodb', label: 'MongoDB', description: 'Document collections layer' },
    { id: 'supabase', label: 'Supabase', description: 'PostgREST table layer' },
    { id: 'mysql', label: 'MySQL', description: 'Relational tables layer' },
  ];

  protected readonly exportScopeOptions: ExportScopeOption[] = [
    {
      id: 'full',
      label: 'Full composite',
      description: 'Export the entire canvas graph',
    },
    {
      id: 'single',
      label: 'Selected node',
      description: 'Primary selected node plus upstream dependencies',
    },
    {
      id: 'selection',
      label: 'Selection neighborhood',
      description: 'All selected nodes and binding-connected neighbors',
    },
  ];

  protected readonly loading = signal(false);
  protected readonly downloading = signal(false);
  protected readonly exportScope = signal<ExportScope>('full');
  protected readonly uiTarget = signal<UiTarget>('react');
  protected readonly serverTarget = signal<ServerTarget>('nest');
  protected readonly databaseTarget = signal<DatabaseTarget>('postgresql');
  protected readonly bundle = signal<ExportBundleResponse | null>(null);
  protected readonly validationIssues = signal<ValidationIssue[]>([]);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.open()) {
        void this.refreshPreview();
      }
    });
  }

  protected close(): void {
    this.closed.emit();
  }

  protected setUiTarget(target: UiTarget): void {
    if (this.uiTarget() === target) {
      return;
    }
    this.uiTarget.set(target);
    void this.refreshPreview();
  }

  protected setServerTarget(target: ServerTarget): void {
    if (this.serverTarget() === target) {
      return;
    }
    this.serverTarget.set(target);
    void this.refreshPreview();
  }

  protected setDatabaseTarget(target: DatabaseTarget): void {
    if (this.databaseTarget() === target) {
      return;
    }
    this.databaseTarget.set(target);
    void this.refreshPreview();
  }

  protected setExportScope(scope: ExportScope): void {
    if (this.exportScope() === scope) {
      return;
    }
    this.exportScope.set(scope);
    void this.refreshPreview();
  }

  protected scopeHint(): string | null {
    const scope = this.exportScope();
    if (scope === 'full') {
      return null;
    }
    const selectedIds = this.state.selectedNodeIds();
    if (selectedIds.length === 0) {
      return 'Select a node on the canvas before exporting with this scope.';
    }
    if (selectedIds.length === 1) {
      const selected = this.state.selectedNode();
      return selected ? `Using canvas selection: ${selected.label}` : null;
    }
    return `Using ${selectedIds.length} selected nodes for export scope.`;
  }

  protected scopeSelectionMissing(): boolean {
    return this.exportScope() !== 'full' && this.state.selectedNodeIds().length === 0;
  }

  protected async refreshPreview(): Promise<void> {
    if (this.scopeSelectionMissing()) {
      this.loading.set(false);
      this.bundle.set(null);
      this.validationIssues.set([]);
      this.errorMessage.set('Select a canvas node for this export scope.');
      return;
    }

    this.loading.set(true);
    this.bundle.set(null);
    this.validationIssues.set([]);
    this.errorMessage.set(null);

    try {
      const composite = this.buildExportComposite();
      const response = await firstValueFrom(this.exportApi.generateBundle(composite));
      this.bundle.set(response);
    } catch (error) {
      this.handleExportError(error);
    } finally {
      this.loading.set(false);
    }
  }

  protected async downloadZip(): Promise<void> {
    const current = this.bundle();
    if (!current) {
      return;
    }

    this.downloading.set(true);
    try {
      const composite = this.buildExportComposite();
      const slug = this.exportZip.slugify(composite.name);
      await this.exportZip.download(current.files, `${slug}-export.zip`);
    } finally {
      this.downloading.set(false);
    }
  }

  protected filePaths(files: GeneratedFile[]): string[] {
    return files.map((file) => file.path).sort();
  }

  protected targetsLabel(): string {
    const current = this.bundle();
    const ui = current?.ir.targets.ui ?? this.uiTarget();
    const server = current?.ir.targets.server ?? this.serverTarget();
    const database = current?.ir.targets.database ?? this.databaseTarget();
    return `${ui} UI + ${server} + ${database}`;
  }

  private buildExportComposite(): Composite {
    const payload = this.state.buildCompositePayload();
    const scope = this.exportScope();
    const seedNodeIds = this.state.selectedNodeIds();

    const scoped = resolveExportComposite(
      {
        ...payload,
        exportTargets: {
          ...payload.exportTargets,
          ui: this.uiTarget(),
          server: this.serverTarget(),
          database: this.databaseTarget(),
        },
      },
      { scope, seedNodeIds },
    );

    return scoped;
  }

  private handleExportError(error: unknown): void {
    if (error instanceof HttpErrorResponse && error.status === 400) {
      const body = error.error as ExportValidationErrorBody | undefined;
      if (body?.issues?.length) {
        this.validationIssues.set(body.issues);
        this.errorMessage.set(body.message ?? 'Composite validation failed for export');
        return;
      }
    }

    this.errorMessage.set(
      error instanceof Error ? error.message : 'Export preview failed. Is the API running?',
    );
  }
}
