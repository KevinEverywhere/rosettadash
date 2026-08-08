import { Injectable } from '@nestjs/common';
import { Composite, ExportIR, buildExportIR, defaultComponentRegistry } from '@dashbuilder/core';
import { generateAngularUiFiles } from '@dashbuilder/exporters-angular';
import { generateNestInfraFiles } from '@dashbuilder/exporters-nest';
import { generateReactUiFiles } from '@dashbuilder/exporters-react';
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

  buildNestExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateNestInfraFiles(ir);
    return { ir, files };
  }

  buildBundleExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const uiFiles = this.generateUiFiles(ir);
    const files = [...uiFiles, ...generateNestInfraFiles(ir)];
    return { ir, files };
  }

  private generateUiFiles(ir: ExportIR) {
    switch (ir.targets.ui) {
      case 'angular':
        return generateAngularUiFiles(ir);
      case 'vue':
        return generateVueUiFiles(ir);
      default:
        return generateReactUiFiles(ir);
    }
  }
}
