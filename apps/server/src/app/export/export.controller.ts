import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import type { Composite } from '@dashbuilder/core';
import { ExportBuildError } from '@dashbuilder/core';
import { AngularExportError } from '@dashbuilder/exporters-angular';
import { NestExportError } from '@dashbuilder/exporters-nest';
import { ReactExportError } from '@dashbuilder/exporters-react';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  private handleExportError(error: unknown): never {
    if (error instanceof ExportBuildError) {
      throw new BadRequestException({
        message: 'Composite validation failed for export',
        issues: error.issues,
      });
    }
    if (error instanceof ReactExportError || error instanceof NestExportError || error instanceof AngularExportError) {
      throw new BadRequestException({
        message: error.message,
      });
    }
    throw error;
  }

  @Post('ir')
  buildExportIr(@Body() composite: Composite) {
    try {
      return this.exportService.buildIr(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('react')
  buildReactExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildReactExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('angular')
  buildAngularExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildAngularExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('nest')
  buildNestExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildNestExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('bundle')
  buildBundleExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildBundleExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }
}
