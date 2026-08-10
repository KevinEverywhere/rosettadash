import { Injectable } from '@angular/core';

export type ComponentPreviewTemplateId = 'status-badge' | 'metric-chip';

@Injectable({ providedIn: 'root' })
export class ComponentPreviewAdapterRegistry {
  private readonly templates = new Map<string, ComponentPreviewTemplateId>();

  register(type: string, templateId: ComponentPreviewTemplateId): void {
    if (this.templates.has(type)) {
      throw new Error(`Preview adapter already registered for ${type}`);
    }
    this.templates.set(type, templateId);
  }

  getTemplateId(type: string): ComponentPreviewTemplateId | undefined {
    return this.templates.get(type);
  }

  has(type: string): boolean {
    return this.templates.has(type);
  }
}

export function registerDefaultComponentPreviewAdapters(
  registry: ComponentPreviewAdapterRegistry,
): void {
  registry.register('visual.plugin.status-badge', 'status-badge');
  registry.register('visual.plugin.metric-chip', 'metric-chip');
}
