import type { DataType } from '../model/data-types';
import type {
  ExportTargetConfig,
  NodeCategory,
  NodeLayout,
  Port,
} from '../model/types';

export interface ExportIRMeta {
  compositeId: string;
  compositeName: string;
  version: number;
  generatedAt: string;
}

export interface IRStyleTokens {
  preset: 'neutral';
}

export interface EnvVarSpec {
  key: string;
  description?: string;
  required: boolean;
  example?: string;
}

export interface IRComponent {
  id: string;
  type: string;
  label: string;
  category: NodeCategory;
  properties: Record<string, unknown>;
  layout?: NodeLayout;
  inputs: Port[];
  outputs: Port[];
}

export interface IRLayout {
  id: string;
  type: string;
  label: string;
  properties: Record<string, unknown>;
  layout?: NodeLayout;
}

export interface IRDataSource {
  id: string;
  type: string;
  label: string;
  connectionEnvKey?: string;
  anonKeyEnvKey?: string;
  table?: string;
  collection?: string;
  properties: Record<string, unknown>;
}

export interface IRRoute {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  handlerNodeId?: string;
}

export interface IREventBinding {
  bindingId: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  dataType: DataType;
}

export interface ExportIRTargets {
  ui: NonNullable<ExportTargetConfig['ui']>;
  server: NonNullable<ExportTargetConfig['server']>;
  database?: ExportTargetConfig['database'];
}

export interface ExportIR {
  meta: ExportIRMeta;
  targets: ExportIRTargets;
  envVars: EnvVarSpec[];
  components: IRComponent[];
  layouts: IRLayout[];
  dataSources: IRDataSource[];
  routes: IRRoute[];
  events: IREventBinding[];
  styles: IRStyleTokens;
}

export interface BuildExportIROptions {
  generatedAt?: string;
  defaultTargets?: Partial<ExportTargetConfig>;
}
