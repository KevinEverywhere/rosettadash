import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import type { Composite, ValidationIssue } from '@dashbuilder/core';
import { firstValueFrom } from 'rxjs';
import { BuilderStateService } from '../builder-state.service';
import {
  ExportApiService,
  ExportBundleResponse,
  ExportValidationErrorBody,
  GeneratedFile,
} from './export-api.service';
import { ExportZipService } from './export-zip.service';

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

  protected readonly loading = signal(false);
  protected readonly downloading = signal(false);
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

  protected async refreshPreview(): Promise<void> {
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
    if (!current) {
      return 'React UI + NestJS + PostgreSQL';
    }
    const { targets } = current.ir;
    const database = targets.database ? ` + ${targets.database}` : '';
    return `${targets.ui} UI + ${targets.server}${database}`;
  }

  private buildExportComposite(): Composite {
    const payload = this.state.buildCompositePayload();
    return {
      ...payload,
      exportTargets: payload.exportTargets ?? {
        ui: 'react',
        server: 'nest',
        database: 'postgresql',
      },
    };
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
