import type { ExportIR } from '../ir/types';

export interface GeneratedFile {
  path: string;
  content: string;
  encoding: 'utf-8';
  description?: string;
}

export interface ExportOptions {
  /** Root folder for UI bundles (default varies by exporter). */
  rootDir?: string;
}

export type ExporterTargetKind = 'ui' | 'server' | 'database';

export type ExporterGenerateFn = (ir: ExportIR, options?: ExportOptions) => GeneratedFile[];

/** Runtime plugin contract consumed by the export orchestrator. */
export interface ExporterPlugin {
  id: string;
  label: string;
  targetKind: ExporterTargetKind;
  supportedTargets: readonly string[];
  packageName: string;
  entryExport: string;
  generate: ExporterGenerateFn;
}

/** Metadata-only registration used by docs, tests, and future dynamic loading. */
export interface ExporterPluginDescriptor {
  id: string;
  label: string;
  targetKind: ExporterTargetKind;
  supportedTargets: readonly string[];
  packageName: string;
  entryExport: string;
}

export function toExporterPluginDescriptor(plugin: ExporterPlugin): ExporterPluginDescriptor {
  return {
    id: plugin.id,
    label: plugin.label,
    targetKind: plugin.targetKind,
    supportedTargets: plugin.supportedTargets,
    packageName: plugin.packageName,
    entryExport: plugin.entryExport,
  };
}
