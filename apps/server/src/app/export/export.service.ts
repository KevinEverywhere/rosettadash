import { Injectable } from '@nestjs/common';
import { Composite, buildExportIR, defaultComponentRegistry } from '@dashbuilder/core';

@Injectable()
export class ExportService {
  buildIr(composite: Composite) {
    return buildExportIR(composite, defaultComponentRegistry);
  }
}
