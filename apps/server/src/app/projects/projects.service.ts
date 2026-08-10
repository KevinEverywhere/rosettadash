import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Composite,
  CompositeDiff,
  CompositeRevision,
  CompositeVersionSummary,
  Project,
  ValidationIssue,
  defaultComponentRegistry,
  diffComposite,
  validateComposite,
} from '@dashbuilder/core';

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}

export type CreateCompositeInput = Omit<Composite, 'id' | 'version'> & {
  id?: string;
};

export class CompositeValidationError extends Error {
  constructor(public readonly issues: ValidationIssue[]) {
    super('Composite validation failed');
    this.name = 'CompositeValidationError';
  }
}

@Injectable()
export class ProjectsService {
  private readonly projects = new Map<string, Project>();
  private readonly compositeRevisions = new Map<string, CompositeRevision[]>();

  listProjects(): Project[] {
    return [...this.projects.values()].sort((a, b) =>
      a.updatedAt.localeCompare(b.updatedAt) * -1,
    );
  }

  getProject(id: string): Project {
    const project = this.projects.get(id);
    if (!project) {
      throw new NotFoundException(`Project "${id}" not found`);
    }
    return project;
  }

  createProject(input: CreateProjectInput): Project {
    const timestamp = new Date().toISOString();
    const project: Project = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      description: input.description?.trim(),
      composites: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.projects.set(project.id, project);
    return project;
  }

  updateProject(id: string, input: UpdateProjectInput): Project {
    const project = this.getProject(id);
    const updated: Project = {
      ...project,
      name: input.name?.trim() ?? project.name,
      description:
        input.description !== undefined ? input.description.trim() : project.description,
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  deleteProject(id: string): void {
    const project = this.projects.get(id);
    if (!project) {
      throw new NotFoundException(`Project "${id}" not found`);
    }
    for (const composite of project.composites) {
      this.compositeRevisions.delete(this.revisionKey(id, composite.id));
    }
    this.projects.delete(id);
  }

  listComposites(projectId: string): Composite[] {
    return this.getProject(projectId).composites;
  }

  getComposite(projectId: string, compositeId: string): Composite {
    const composite = this.getProject(projectId).composites.find((c) => c.id === compositeId);
    if (!composite) {
      throw new NotFoundException(
        `Composite "${compositeId}" not found in project "${projectId}"`,
      );
    }
    return composite;
  }

  createComposite(projectId: string, input: CreateCompositeInput): Composite {
    const project = this.getProject(projectId);
    const composite: Composite = {
      ...input,
      id: input.id ?? crypto.randomUUID(),
      version: 1,
    };

    this.assertValidComposite(composite);

    const updated: Project = {
      ...project,
      composites: [...project.composites, composite],
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(projectId, updated);
    this.storeRevision(projectId, composite);
    return composite;
  }

  listCompositeVersions(projectId: string, compositeId: string): CompositeVersionSummary[] {
    this.getComposite(projectId, compositeId);
    return this.getRevisionList(projectId, compositeId).map((revision) => ({
      version: revision.version,
      savedAt: revision.savedAt,
      nodeCount: revision.composite.nodes.length,
      bindingCount: revision.composite.bindings.length,
    }));
  }

  getCompositeVersion(
    projectId: string,
    compositeId: string,
    version: number,
  ): CompositeRevision {
    this.getComposite(projectId, compositeId);
    const revision = this.getRevisionList(projectId, compositeId).find(
      (entry) => entry.version === version,
    );
    if (!revision) {
      throw new NotFoundException(
        `Composite "${compositeId}" version ${version} not found in project "${projectId}"`,
      );
    }
    return revision;
  }

  diffCompositeVersions(
    projectId: string,
    compositeId: string,
    fromVersion: number,
    toVersion: number,
  ): CompositeDiff {
    const from = this.getCompositeVersion(projectId, compositeId, fromVersion).composite;
    const to = this.getCompositeVersion(projectId, compositeId, toVersion).composite;
    return diffComposite(from, to);
  }

  updateComposite(projectId: string, compositeId: string, input: Composite): Composite {
    const project = this.getProject(projectId);
    const index = project.composites.findIndex((c) => c.id === compositeId);
    if (index === -1) {
      throw new NotFoundException(
        `Composite "${compositeId}" not found in project "${projectId}"`,
      );
    }

    const existing = project.composites[index];
    const composite: Composite = {
      ...input,
      id: compositeId,
      version: existing.version + 1,
    };

    this.assertValidComposite(composite);

    const composites = [...project.composites];
    composites[index] = composite;

    this.projects.set(projectId, {
      ...project,
      composites,
      updatedAt: new Date().toISOString(),
    });

    this.storeRevision(projectId, composite);
    return composite;
  }

  deleteComposite(projectId: string, compositeId: string): void {
    const project = this.getProject(projectId);
    const next = project.composites.filter((c) => c.id !== compositeId);
    if (next.length === project.composites.length) {
      throw new NotFoundException(
        `Composite "${compositeId}" not found in project "${projectId}"`,
      );
    }
    this.projects.set(projectId, {
      ...project,
      composites: next,
      updatedAt: new Date().toISOString(),
    });
    this.compositeRevisions.delete(this.revisionKey(projectId, compositeId));
  }

  private assertValidComposite(composite: Composite): void {
    const result = validateComposite(composite, defaultComponentRegistry, { mode: 'draft' });
    if (!result.valid) {
      throw new CompositeValidationError(result.issues);
    }
  }

  private revisionKey(projectId: string, compositeId: string): string {
    return `${projectId}:${compositeId}`;
  }

  private getRevisionList(projectId: string, compositeId: string): CompositeRevision[] {
    return this.compositeRevisions.get(this.revisionKey(projectId, compositeId)) ?? [];
  }

  private storeRevision(projectId: string, composite: Composite): void {
    const key = this.revisionKey(projectId, composite.id);
    const revisions = this.getRevisionList(projectId, composite.id);
    const nextRevision: CompositeRevision = {
      version: composite.version,
      savedAt: new Date().toISOString(),
      composite: structuredClone(composite),
    };
    this.compositeRevisions.set(key, [...revisions, nextRevision]);
  }
}
