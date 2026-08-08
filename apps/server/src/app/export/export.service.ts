import { Injectable } from '@nestjs/common';
import { Composite, buildExportIR, defaultComponentRegistry } from '@dashbuilder/core';
import { generateNestInfraFiles } from '@dashbuilder/exporters-nest';
import { generateReactUiFiles } from '@dashbuilder/exporters-react';

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

  buildNestExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = generateNestInfraFiles(ir);
    return { ir, files };
  }

  buildBundleExport(composite: Composite) {
    const ir = this.buildIr(composite);
    const files = [...generateReactUiFiles(ir), ...generateNestInfraFiles(ir)];
    return { ir, files };
  }
}
