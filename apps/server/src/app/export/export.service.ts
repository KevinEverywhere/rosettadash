import { Injectable } from '@nestjs/common';
import { Composite, ExportIR, buildExportIR, defaultComponentRegistry } from '@dashbuilder/core';
import { generateAngularUiFiles } from '@dashbuilder/exporters-angular';
import { generateExpressInfraFiles } from '@dashbuilder/exporters-express';
import { generateNestInfraFiles } from '@dashbuilder/exporters-nest';
import { generateNextInfraFiles } from '@dashbuilder/exporters-next';
import { generateNuxtInfraFiles } from '@dashbuilder/exporters-nuxt';
import { generateReactUiFiles } from '@dashbuilder/exporters-react';
import { generateSvelteUiFiles } from '@dashbuilder/exporters-svelte';
import { generateVueUiFiles } from '@dashbuilder/exporters-vue';

@Injectable()
export class ExportService {
  buildIr(composite: Composite) {
    return buildExportIR(composite, defaultComponentRegistry);
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

  buildBundleExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const uiFiles = this.generateUiFiles(ir);
    const serverFiles = this.generateServerFiles(ir);
    return { ir, files: [...uiFiles, ...serverFiles] };
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
