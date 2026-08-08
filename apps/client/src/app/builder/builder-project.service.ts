import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BuilderStateService } from './builder-state.service';
import { ProjectsApiService } from './projects-api.service';

interface BuilderSession {
  projectId: string;
  compositeId: string;
}

const SESSION_KEY = 'dashbuilder:session';

@Injectable({ providedIn: 'root' })
export class BuilderProjectService {
  private readonly api = inject(ProjectsApiService);
  private readonly state = inject(BuilderStateService);

  async initialize(): Promise<void> {
    this.state.loading.set(true);
    this.state.errorMessage.set(null);

    try {
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
      return true;
    } catch {
      return false;
    }
  }

  private async createNewWorkspace(): Promise<void> {
    const project = await firstValueFrom(
      this.api.createProject({ name: 'Untitled Dashboard' }),
    );

    const composite = await firstValueFrom(
      this.api.createComposite(project.id, {
        name: 'Main',
        nodes: [],
        bindings: [],
      }),
    );

    const hydrated = { ...project, composites: [composite] };
    this.state.setProjectContext(hydrated, composite);
    this.writeSession({ projectId: project.id, compositeId: composite.id });
  }

  private readSession(): BuilderSession | null {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as BuilderSession;
    } catch {
      return null;
    }
  }

  private writeSession(session: BuilderSession): void {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private toMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Something went wrong while talking to the server.';
  }
}
