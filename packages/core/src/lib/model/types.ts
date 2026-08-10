import type { DataType } from './data-types';
import type { DomainContext } from '../domain/domain-context';

export type NodeCategory = 'visual' | 'layout' | 'logic' | 'domain' | 'infra';

export type PropertySchemaType = 'string' | 'number' | 'boolean' | 'select' | 'json';

export interface PropertySchema {
  key: string;
  label: string;
  type: PropertySchemaType;
  default?: unknown;
  required?: boolean;
  options?: { label: string; value: string | number | boolean }[];
  description?: string;
}

export interface PortDefinition {
  id: string;
  name: string;
  dataType: DataType;
  required?: boolean;
  description?: string;
}

export interface ComponentDefinition {
  type: string;
  category: NodeCategory;
  label: string;
  description?: string;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  properties: PropertySchema[];
  isVisual: boolean;
}

export interface Port {
  id: string;
  name: string;
  dataType: DataType;
  required?: boolean;
}

export interface NodeLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComponentNodeMeta {
  frameworkHints?: Record<string, unknown>;
  suggestedBy?: 'user' | 'defaults-engine';
}

export interface ComponentNode {
  id: string;
  type: string;
  label: string;
  properties: Record<string, unknown>;
  ports: {
    inputs: Port[];
    outputs: Port[];
  };
  layout?: NodeLayout;
  meta?: ComponentNodeMeta;
}

export interface Binding {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}

export interface ExportTargetConfig {
  ui?: 'react' | 'angular' | 'vue' | 'svelte';
  server?: 'next' | 'nuxt' | 'nest' | 'express';
  database?: 'mongodb' | 'postgresql' | 'supabase' | 'mysql';
}

export interface StackProfile {
  ui: 'react' | 'angular' | 'vue' | 'svelte' | 'any';
  server?: ExportTargetConfig['server'];
  database?: ExportTargetConfig['database'];
}

export interface Composite {
  id: string;
  name: string;
  description?: string;
  templateId?: string;
  nodes: ComponentNode[];
  bindings: Binding[];
  exportTargets?: ExportTargetConfig;
  domainContext?: DomainContext;
  version: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  stackProfile?: StackProfile;
  composites: Composite[];
  createdAt: string;
  updatedAt: string;
}

export interface ValidationIssue {
  code: string;
  message: string;
  nodeId?: string;
  bindingId?: string;
  path?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}
