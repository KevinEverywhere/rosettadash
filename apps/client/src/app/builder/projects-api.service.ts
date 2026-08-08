import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Composite, Project } from '@dashbuilder/core';
import { Observable } from 'rxjs';

export interface CreateProjectBody {
  name: string;
  description?: string;
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

  updateComposite(projectId: string, compositeId: string, body: Composite): Observable<Composite> {
    return this.http.put<Composite>(`${this.base}/${projectId}/composites/${compositeId}`, body);
  }

  createComposite(projectId: string, body: CreateCompositeBody): Observable<Composite> {
    return this.http.post<Composite>(`${this.base}/${projectId}/composites`, body);
  }
}
