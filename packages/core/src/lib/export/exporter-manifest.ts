import type { ExportTargetConfig } from '../model/types';
import type { ExporterPluginDescriptor, ExporterTargetKind } from './exporter-plugin';

export const builtInExporterManifest: readonly ExporterPluginDescriptor[] = [
  {
    id: 'ui.react',
    label: 'React UI',
    targetKind: 'ui',
    supportedTargets: ['react'],
    packageName: '@rosettadash/exporters-react',
    entryExport: 'generateReactUiFiles',
  },
  {
    id: 'ui.angular',
    label: 'Angular UI',
    targetKind: 'ui',
    supportedTargets: ['angular'],
    packageName: '@rosettadash/exporters-angular',
    entryExport: 'generateAngularUiFiles',
  },
  {
    id: 'ui.vue',
    label: 'Vue UI',
    targetKind: 'ui',
    supportedTargets: ['vue'],
    packageName: '@rosettadash/exporters-vue',
    entryExport: 'generateVueUiFiles',
  },
  {
    id: 'ui.svelte',
    label: 'Svelte UI',
    targetKind: 'ui',
    supportedTargets: ['svelte'],
    packageName: '@rosettadash/exporters-svelte',
    entryExport: 'generateSvelteUiFiles',
  },
  {
    id: 'ui.web-components',
    label: 'Web Components UI',
    targetKind: 'ui',
    supportedTargets: ['web-components'],
    packageName: '@rosettadash/exporters-web-components',
    entryExport: 'generateWebComponentsUiFiles',
  },
  {
    id: 'server.nest',
    label: 'NestJS server',
    targetKind: 'server',
    supportedTargets: ['nest'],
    packageName: '@rosettadash/exporters-nest',
    entryExport: 'generateNestInfraFiles',
  },
  {
    id: 'server.express',
    label: 'Express server',
    targetKind: 'server',
    supportedTargets: ['express'],
    packageName: '@rosettadash/exporters-express',
    entryExport: 'generateExpressInfraFiles',
  },
  {
    id: 'server.next',
    label: 'Next.js server',
    targetKind: 'server',
    supportedTargets: ['next'],
    packageName: '@rosettadash/exporters-next',
    entryExport: 'generateNextInfraFiles',
  },
  {
    id: 'server.nuxt',
    label: 'Nuxt server',
    targetKind: 'server',
    supportedTargets: ['nuxt'],
    packageName: '@rosettadash/exporters-nuxt',
    entryExport: 'generateNuxtInfraFiles',
  },
  {
    id: 'database.mongodb',
    label: 'MongoDB layer',
    targetKind: 'database',
    supportedTargets: ['mongodb'],
    packageName: '@rosettadash/exporters-mongodb',
    entryExport: 'generateMongoInfraFiles',
  },
  {
    id: 'database.supabase',
    label: 'Supabase layer',
    targetKind: 'database',
    supportedTargets: ['supabase'],
    packageName: '@rosettadash/exporters-supabase',
    entryExport: 'generateSupabaseInfraFiles',
  },
  {
    id: 'database.mysql',
    label: 'MySQL layer',
    targetKind: 'database',
    supportedTargets: ['mysql'],
    packageName: '@rosettadash/exporters-mysql',
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
