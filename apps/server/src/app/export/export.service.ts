import { Injectable } from '@nestjs/common';
import {
  Composite,
  ExportIR,
  StackProfile,
  builtInExporterManifest,
  buildExportIR,
  defaultComponentRegistry,
} from '@dashbuilder/core';
import { generateAngularUiFiles } from '@dashbuilder/exporters-angular';
import { generateExpressInfraFiles } from '@dashbuilder/exporters-express';
import { generateMongoInfraFiles } from '@dashbuilder/exporters-mongodb';
import { generateMysqlInfraFiles } from '@dashbuilder/exporters-mysql';
import { generateSupabaseInfraFiles } from '@dashbuilder/exporters-supabase';
import { generateNestInfraFiles } from '@dashbuilder/exporters-nest';
import { generateNextInfraFiles } from '@dashbuilder/exporters-next';
import { generateNuxtInfraFiles } from '@dashbuilder/exporters-nuxt';
import { generateReactUiFiles } from '@dashbuilder/exporters-react';
import { generateSvelteUiFiles } from '@dashbuilder/exporters-svelte';
import { generateVueUiFiles } from '@dashbuilder/exporters-vue';

@Injectable()
export class ExportService {
  /** Plugin metadata registry — see docs/16-exporter-plugin-sdk.md */
  readonly exporterManifest = builtInExporterManifest;

  buildIr(composite: Composite, stackProfile?: StackProfile) {
    return buildExportIR(composite, defaultComponentRegistry, { stackProfile });
  }

  buildReactExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateReactUiFiles(ir);
    return { ir, files };
  }

  buildAngularExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateAngularUiFiles(ir);
    return { ir, files };
  }

  buildVueExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateVueUiFiles(ir);
    return { ir, files };
  }

  buildSvelteExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateSvelteUiFiles(ir);
    return { ir, files };
  }

  buildNestExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateNestInfraFiles(ir);
    return { ir, files };
  }

  buildExpressExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateExpressInfraFiles(ir);
    return { ir, files };
  }

  buildNextExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateNextInfraFiles(ir);
    return { ir, files };
  }

  buildNuxtExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateNuxtInfraFiles(ir);
    return { ir, files };
  }

  buildMongoExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateMongoInfraFiles(ir);
    return { ir, files };
  }

  buildSupabaseExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateSupabaseInfraFiles(ir);
    return { ir, files };
  }

  buildMysqlExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateMysqlInfraFiles(ir);
    return { ir, files };
  }

  buildBundleExport(composite: Composite, stackProfile?: StackProfile) {
    const ir = this.buildIr(composite, stackProfile);
    const uiFiles = this.generateUiFiles(ir);
    const databaseFiles = this.generateDatabaseFiles(ir);
    if (databaseFiles.length > 0) {
      return { ir, files: [...uiFiles, ...databaseFiles] };
    }

    if (!this.shouldGenerateServerFiles(ir)) {
      return { ir, files: uiFiles };
    }

    const serverFiles = this.generateServerFiles(ir);
    return { ir, files: [...uiFiles, ...serverFiles] };
  }

  private shouldGenerateServerFiles(ir: ExportIR): boolean {
    if (ir.dataSources.some((source) => source.type.startsWith('infra.server.'))) {
      return true;
    }

    return ir.dataSources.some((source) =>
      ['infra.postgresql', 'infra.mongodb', 'infra.supabase', 'infra.mysql'].includes(source.type),
    );
  }

  private generateDatabaseFiles(ir: ExportIR) {
    switch (ir.targets.database) {
      case 'mongodb':
        return generateMongoInfraFiles(ir);
      case 'supabase':
        return generateSupabaseInfraFiles(ir);
      case 'mysql':
        return generateMysqlInfraFiles(ir);
      default:
        return [];
    }
  }

  private generateUiFiles(ir: ExportIR) {
    switch (ir.targets.ui) {
      case 'angular':
        return generateAngularUiFiles(ir);
      case 'vue':
        return generateVueUiFiles(ir);
      case 'svelte':
        return generateSvelteUiFiles(ir);
      default:
        return generateReactUiFiles(ir);
    }
  }

  private generateServerFiles(ir: ExportIR) {
    switch (ir.targets.server) {
      case 'express':
        return generateExpressInfraFiles(ir);
      case 'next':
        return generateNextInfraFiles(ir);
      case 'nuxt':
        return generateNuxtInfraFiles(ir);
      default:
        return generateNestInfraFiles(ir);
    }
  }
}
