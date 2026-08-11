import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  normalizeStackProfile,
  stackProfileToExportTargets,
  type StackProfile,
} from '@rosettadash/core';
import { BuilderStateService } from './builder-state.service';
import { ProjectsApiService } from './projects-api.service';
import {
  BUILDER_SESSION_KEY,
  clearLibraryRestore,
  clearPendingStackProfile,
  readBuilderSession,
  readLibraryRestore,
  readPendingStackProfile,
  writeActiveStackProfile,
  type BuilderSession,
} from '../welcome/stack-profile-session';

@Injectable({ providedIn: 'root' })
export class BuilderProjectService {
  private readonly api = inject(ProjectsApiService);
  private readonly state = inject(BuilderStateService);

  async initialize(): Promise<void> {
    this.state.loading.set(true);
    this.state.errorMessage.set(null);

    try {
      const libraryRestore = readLibraryRestore();
      if (libraryRestore) {
        clearLibraryRestore();
        await this.createNewWorkspace();
        this.state.applySavedComposite({
          ...libraryRestore.composite,
          name: libraryRestore.composite.name || 'Restored dashboard',
        });
        if (libraryRestore.stackProfile) {
          writeActiveStackProfile(libraryRestore.stackProfile);
        }
        this.state.dirty.set(true);
        this.state.saveStatus.set('idle');
        return;
      }

      const session = this.readSession();
      if (session) {
        const restored = await this.tryRestore(session);
        if (restored) {
          return;
        }
      }
      await this.createNewWorkspace();
    } catch (error) {
      this.state.errorMessage.set(this.toMessage(error));
    } finally {
      this.state.loading.set(false);
    }
  }

  async save(): Promise<void> {
    const project = this.state.project();
    const composite = this.state.composite();
    if (!project || !composite) {
      return;
    }

    this.state.saveStatus.set('saving');
    this.state.errorMessage.set(null);

    try {
      const payload = this.state.buildCompositePayload();
      const updated = await firstValueFrom(
        this.api.updateComposite(project.id, composite.id, payload),
      );
      this.state.applySavedComposite(updated);
      this.writeSession({ projectId: project.id, compositeId: updated.id });
    } catch (error) {
      this.state.saveStatus.set('error');
      this.state.errorMessage.set(this.toMessage(error));
      throw error;
    }
  }

  private async tryRestore(session: BuilderSession): Promise<boolean> {
    try {
      const project = await firstValueFrom(this.api.getProject(session.projectId));
      const composite =
        project.composites.find((item) => item.id === session.compositeId) ??
        project.composites[0];

      if (!composite) {
        return false;
      }

      this.state.setProjectContext(project, composite);
      this.writeSession({ projectId: project.id, compositeId: composite.id });
      if (project.stackProfile) {
        writeActiveStackProfile(project.stackProfile);
      }
      return true;
    } catch {
      return false;
    }
  }

  private async createNewWorkspace(): Promise<void> {
    const pendingStack = readPendingStackProfile();
    const stackProfile: StackProfile = normalizeStackProfile(pendingStack ?? { ui: 'web-components' }) ?? {
      ui: 'web-components',
    };
    clearPendingStackProfile();

    const exportTargets = stackProfileToExportTargets(stackProfile);

    const project = await firstValueFrom(
      this.api.createProject({
        name: 'Untitled Dashboard',
        stackProfile,
      }),
    );

    const composite = await firstValueFrom(
      this.api.createComposite(project.id, {
        name: 'Main',
        nodes: [],
        bindings: [],
        ...(exportTargets ? { exportTargets } : {}),
      }),
    );

    const hydrated = { ...project, composites: [composite] };
    this.state.setProjectContext(hydrated, composite);
    this.writeSession({ projectId: project.id, compositeId: composite.id });
    writeActiveStackProfile(stackProfile);
  }

  private readSession(): BuilderSession | null {
    return readBuilderSession();
  }

  private writeSession(session: BuilderSession): void {
    sessionStorage.setItem(BUILDER_SESSION_KEY, JSON.stringify(session));
  }

  private toMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Something went wrong while talking to the server.';
  }
}
