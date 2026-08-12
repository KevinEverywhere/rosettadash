import type { Composite } from '../model/types';
import type { ComponentRegistry } from '../registry/component-registry';

export interface BuildCompositeTemplateOptions {
  id?: string;
  version?: number;
}

export interface CompositeTemplateDefinition {
  id: string;
  name: string;
  description: string;
  build: (
    registry: ComponentRegistry,
    options?: BuildCompositeTemplateOptions,
  ) => Composite;
}
