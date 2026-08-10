import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Composite, CompositeDiff, CompositeVersionSummary, Project, StackProfile } from '@dashbuilder/core';
import { Observable } from 'rxjs';

export interface CreateProjectBody {
  name: string;
  description?: string;
  stackProfile?: StackProfile;
}

export type CreateCompositeBody = Omit<Composite, 'id' | 'version'> & { id?: string };

@Injectable({ providedIn: 'root' })
export class ProjectsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/projects';

  listProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.base);
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.base}/${id}`);
  }

  createProject(body: CreateProjectBody): Observable<Project> {
    return this.http.post<Project>(this.base, body);
  }

  updateProject(id: string, body: Partial<CreateProjectBody>): Observable<Project> {
    return this.http.patch<Project>(`${this.base}/${id}`, body);
  }

  updateComposite(projectId: string, compositeId: string, body: Composite): Observable<Composite> {
    return this.http.put<Composite>(`${this.base}/${projectId}/composites/${compositeId}`, body);
  }

  createComposite(projectId: string, body: CreateCompositeBody): Observable<Composite> {
    return this.http.post<Composite>(`${this.base}/${projectId}/composites`, body);
  }

  listCompositeVersions(
    projectId: string,
    compositeId: string,
  ): Observable<CompositeVersionSummary[]> {
    return this.http.get<CompositeVersionSummary[]>(
      `${this.base}/${projectId}/composites/${compositeId}/versions`,
    );
  }

  diffCompositeVersions(
    projectId: string,
    compositeId: string,
    fromVersion: number,
    toVersion: number,
  ): Observable<CompositeDiff> {
    return this.http.get<CompositeDiff>(
      `${this.base}/${projectId}/composites/${compositeId}/diff`,
      {
        params: {
          from: fromVersion,
          to: toVersion,
        },
      },
    );
  }
}
