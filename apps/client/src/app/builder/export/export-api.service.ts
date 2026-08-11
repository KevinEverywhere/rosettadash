import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Composite, ExportBundleRequest, ExportIR, StackProfile, ValidationIssue } from '@rosettadash/core';
import { Observable } from 'rxjs';

export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface ExportBundleResponse {
  ir: ExportIR;
  files: GeneratedFile[];
}

export interface ExportValidationErrorBody {
  message: string;
  issues: ValidationIssue[];
}

@Injectable({ providedIn: 'root' })
export class ExportApiService {
  private readonly http = inject(HttpClient);

  generateBundle(composite: Composite, stackProfile?: StackProfile): Observable<ExportBundleResponse> {
    const body: ExportBundleRequest = stackProfile ? { composite, stackProfile } : { composite };
    return this.http.post<ExportBundleResponse>('/api/export/bundle', body);
  }
}
