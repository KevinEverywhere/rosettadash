import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import type { Composite } from '@dashbuilder/core';
import { ExportBuildError } from '@dashbuilder/core';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('ir')
  buildExportIr(@Body() composite: Composite) {
    try {
      return this.exportService.buildIr(composite);
    } catch (error) {
      if (error instanceof ExportBuildError) {
        throw new BadRequestException({
          message: 'Composite validation failed for export',
          issues: error.issues,
        });
      }
      throw error;
    }
  }
}
