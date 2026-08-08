import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Composite,
  Project,
  ValidationIssue,
  defaultComponentRegistry,
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
    if (!this.projects.delete(id)) {
      throw new NotFoundException(`Project "${id}" not found`);
    }
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
    return composite;
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
  }

  private assertValidComposite(composite: Composite): void {
    const result = validateComposite(composite, defaultComponentRegistry);
    if (!result.valid) {
      throw new CompositeValidationError(result.issues);
    }
  }
}
