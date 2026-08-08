import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  NodePreviewSlice,
  PreviewDataBundle,
  PreviewDataRequest,
  getDefaultPreviewData,
} from '@dashbuilder/ui-primitives';
import { firstValueFrom } from 'rxjs';

export type PreviewDataSource = 'default' | 'api';

@Injectable({ providedIn: 'root' })
export class PreviewDataService {
  private readonly http = inject(HttpClient);

  readonly bundle = signal<PreviewDataBundle>(getDefaultPreviewData());
  readonly loading = signal(false);
  readonly source = signal<PreviewDataSource>('default');

  readonly nodeSlices = computed(() => this.bundle().nodes);

  async load(request: PreviewDataRequest): Promise<void> {
    this.loading.set(true);
    try {
      const data = await firstValueFrom(
        this.http.post<PreviewDataBundle>('/api/preview/data', request),
      );
      this.bundle.set(data);
      this.source.set('api');
    } catch {
      this.bundle.set(getDefaultPreviewData());
      this.source.set('default');
    } finally {
      this.loading.set(false);
    }
  }

  sliceForNode(nodeId: string): NodePreviewSlice | undefined {
    return this.bundle().nodes[nodeId];
  }
}
