import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { CompositeDiff, CompositeDiffChange, CompositeVersionSummary } from '@rosettadash/core';
import { firstValueFrom } from 'rxjs';
import { AppSelectComponent } from '../../shared/app-select/app-select.component';
import { BuilderStateService } from '../builder-state.service';
import { ProjectsApiService } from '../projects-api.service';

@Component({
  selector: 'app-version-history-panel',
  imports: [FormsModule, DatePipe, AppSelectComponent],
  templateUrl: './version-history-panel.component.html',
  styleUrl: './version-history-panel.component.scss',
})
export class VersionHistoryPanelComponent {
  private readonly api = inject(ProjectsApiService);
  protected readonly state = inject(BuilderStateService);

  protected readonly versions = signal<CompositeVersionSummary[]>([]);
  protected readonly diff = signal<CompositeDiff | null>(null);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected fromVersion = 1;
  protected toVersion = 1;

  protected readonly versionSelectOptions = computed(() =>
    this.versions().map((entry) => ({
      value: String(entry.version),
      label: `v${entry.version}`,
    })),
  );

  protected get fromVersionValue(): string {
    return String(this.fromVersion);
  }

  protected set fromVersionValue(value: string) {
    this.fromVersion = Number(value);
  }

  protected get toVersionValue(): string {
    return String(this.toVersion);
  }

  protected set toVersionValue(value: string) {
    this.toVersion = Number(value);
  }

  constructor() {
    effect(() => {
      const project = this.state.project();
      const composite = this.state.composite();
      if (!project || !composite) {
        this.versions.set([]);
        this.diff.set(null);
        return;
      }
      void this.loadVersions(project.id, composite.id, composite.version);
    });
  }

  protected async compareVersions(): Promise<void> {
    const project = this.state.project();
    const composite = this.state.composite();
    if (!project || !composite || this.fromVersion === this.toVersion) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      const result = await firstValueFrom(
        this.api.diffCompositeVersions(
          project.id,
          composite.id,
          this.fromVersion,
          this.toVersion,
        ),
      );
      this.diff.set(result);
    } catch {
      this.errorMessage.set('Could not load version diff.');
      this.diff.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  protected changeLabel(change: CompositeDiffChange): string {
    switch (change.kind) {
      case 'node-added':
        return `Added node ${change.label} (${change.nodeType})`;
      case 'node-removed':
        return `Removed node ${change.label} (${change.nodeType})`;
      case 'node-modified':
        return `Updated node ${change.label}: ${change.fields.join(', ')}`;
      case 'binding-added':
        return `Added binding ${change.sourceNodeId} → ${change.targetNodeId}`;
      case 'binding-removed':
        return `Removed binding ${change.sourceNodeId} → ${change.targetNodeId}`;
      case 'binding-modified':
        return `Updated binding ${change.bindingId}: ${change.fields.join(', ')}`;
      case 'metadata-changed':
        return `Updated page metadata: ${change.fields.join(', ')}`;
    }
  }

  private async loadVersions(
    projectId: string,
    compositeId: string,
    currentVersion: number,
  ): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      const entries = await firstValueFrom(
        this.api.listCompositeVersions(projectId, compositeId),
      );
      this.versions.set(entries);
      this.toVersion = currentVersion;
      this.fromVersion = Math.max(1, currentVersion - 1);
      this.diff.set(null);
      if (this.fromVersion !== this.toVersion) {
        await this.compareVersions();
      }
    } catch {
      this.errorMessage.set('Could not load version history.');
      this.versions.set([]);
      this.diff.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
