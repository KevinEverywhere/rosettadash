import {
  builtInExporterManifest,
  listExporterPluginsByKind,
  resolveExporterPluginsForTargets,
} from './exporter-manifest';

describe('exporter manifest', () => {
  it('registers all built-in UI, server, and database exporters', () => {
    expect(listExporterPluginsByKind('ui')).toHaveLength(4);
    expect(listExporterPluginsByKind('server')).toHaveLength(4);
    expect(listExporterPluginsByKind('database')).toHaveLength(3);
    expect(builtInExporterManifest).toHaveLength(11);
  });

  it('uses unique plugin ids and package names', () => {
    const ids = builtInExporterManifest.map((entry) => entry.id);
    const packages = builtInExporterManifest.map((entry) => entry.packageName);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(packages).size).toBe(packages.length);
  });

  it('resolves plugins for a full export target matrix selection', () => {
    const plugins = resolveExporterPluginsForTargets({
      ui: 'react',
      server: 'nest',
      database: 'postgresql',
    });

    expect(plugins.map((entry) => entry.id)).toEqual(['ui.react', 'server.nest']);
  });

  it('resolves optional database layer exporters', () => {
    const plugins = resolveExporterPluginsForTargets({
      ui: 'vue',
      server: 'express',
      database: 'mongodb',
    });

    expect(plugins.map((entry) => entry.id)).toEqual([
      'ui.vue',
      'server.express',
      'database.mongodb',
    ]);
  });
});
