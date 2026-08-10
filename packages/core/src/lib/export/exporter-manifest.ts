import type { ExportTargetConfig } from '../model/types';
import type { ExporterPluginDescriptor, ExporterTargetKind } from './exporter-plugin';

export const builtInExporterManifest: readonly ExporterPluginDescriptor[] = [
  {
    id: 'ui.react',
    label: 'React UI',
    targetKind: 'ui',
    supportedTargets: ['react'],
    packageName: '@dashbuilder/exporters-react',
    entryExport: 'generateReactUiFiles',
  },
  {
    id: 'ui.angular',
    label: 'Angular UI',
    targetKind: 'ui',
    supportedTargets: ['angular'],
    packageName: '@dashbuilder/exporters-angular',
    entryExport: 'generateAngularUiFiles',
  },
  {
    id: 'ui.vue',
    label: 'Vue UI',
    targetKind: 'ui',
    supportedTargets: ['vue'],
    packageName: '@dashbuilder/exporters-vue',
    entryExport: 'generateVueUiFiles',
  },
  {
    id: 'ui.svelte',
    label: 'Svelte UI',
    targetKind: 'ui',
    supportedTargets: ['svelte'],
    packageName: '@dashbuilder/exporters-svelte',
    entryExport: 'generateSvelteUiFiles',
  },
  {
    id: 'server.nest',
    label: 'NestJS server',
    targetKind: 'server',
    supportedTargets: ['nest'],
    packageName: '@dashbuilder/exporters-nest',
    entryExport: 'generateNestInfraFiles',
  },
  {
    id: 'server.express',
    label: 'Express server',
    targetKind: 'server',
    supportedTargets: ['express'],
    packageName: '@dashbuilder/exporters-express',
    entryExport: 'generateExpressInfraFiles',
  },
  {
    id: 'server.next',
    label: 'Next.js server',
    targetKind: 'server',
    supportedTargets: ['next'],
    packageName: '@dashbuilder/exporters-next',
    entryExport: 'generateNextInfraFiles',
  },
  {
    id: 'server.nuxt',
    label: 'Nuxt server',
    targetKind: 'server',
    supportedTargets: ['nuxt'],
    packageName: '@dashbuilder/exporters-nuxt',
    entryExport: 'generateNuxtInfraFiles',
  },
  {
    id: 'database.mongodb',
    label: 'MongoDB layer',
    targetKind: 'database',
    supportedTargets: ['mongodb'],
    packageName: '@dashbuilder/exporters-mongodb',
    entryExport: 'generateMongoInfraFiles',
  },
  {
    id: 'database.supabase',
    label: 'Supabase layer',
    targetKind: 'database',
    supportedTargets: ['supabase'],
    packageName: '@dashbuilder/exporters-supabase',
    entryExport: 'generateSupabaseInfraFiles',
  },
  {
    id: 'database.mysql',
    label: 'MySQL layer',
    targetKind: 'database',
    supportedTargets: ['mysql'],
    packageName: '@dashbuilder/exporters-mysql',
    entryExport: 'generateMysqlInfraFiles',
  },
] as const;

export function getExporterPluginDescriptor(id: string): ExporterPluginDescriptor | undefined {
  return builtInExporterManifest.find((entry) => entry.id === id);
}

export function listExporterPluginsByKind(
  targetKind: ExporterTargetKind,
): ExporterPluginDescriptor[] {
  return builtInExporterManifest.filter((entry) => entry.targetKind === targetKind);
}

export function resolveExporterPluginsForTargets(
  targets: Partial<ExportTargetConfig>,
): ExporterPluginDescriptor[] {
  const resolved: ExporterPluginDescriptor[] = [];

  if (targets.ui) {
    const uiTarget = targets.ui;
    const ui = builtInExporterManifest.find(
      (entry) => entry.targetKind === 'ui' && entry.supportedTargets.includes(uiTarget),
    );
    if (ui) {
      resolved.push(ui);
    }
  }

  if (targets.server) {
    const serverTarget = targets.server;
    const server = builtInExporterManifest.find(
      (entry) =>
        entry.targetKind === 'server' && entry.supportedTargets.includes(serverTarget),
    );
    if (server) {
      resolved.push(server);
    }
  }

  if (targets.database) {
    const databaseTarget = targets.database;
    const database = builtInExporterManifest.find(
      (entry) =>
        entry.targetKind === 'database' && entry.supportedTargets.includes(databaseTarget),
    );
    if (database) {
      resolved.push(database);
    }
  }

  return resolved;
}
