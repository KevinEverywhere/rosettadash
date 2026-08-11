import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import type { Composite, ExportBundleRequest, StackProfile } from '@dashbuilder/core';
import { ExportBuildError } from '@dashbuilder/core';
import { AngularExportError } from '@dashbuilder/exporters-angular';
import { ExpressExportError } from '@dashbuilder/exporters-express';
import { MongoExportError } from '@dashbuilder/exporters-mongodb';
import { MysqlExportError } from '@dashbuilder/exporters-mysql';
import { SupabaseExportError } from '@dashbuilder/exporters-supabase';
import { NestExportError } from '@dashbuilder/exporters-nest';
import { NextExportError } from '@dashbuilder/exporters-next';
import { NuxtExportError } from '@dashbuilder/exporters-nuxt';
import { ReactExportError } from '@dashbuilder/exporters-react';
import { WebComponentsExportError } from '@dashbuilder/exporters-web-components';
import { SvelteExportError } from '@dashbuilder/exporters-svelte';
import { VueExportError } from '@dashbuilder/exporters-vue';
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
    if (
      error instanceof ReactExportError ||
      error instanceof NestExportError ||
      error instanceof ExpressExportError ||
      error instanceof NextExportError ||
      error instanceof NuxtExportError ||
      error instanceof MongoExportError ||
      error instanceof MysqlExportError ||
      error instanceof SupabaseExportError ||
      error instanceof AngularExportError ||
      error instanceof VueExportError ||
      error instanceof SvelteExportError ||
      error instanceof WebComponentsExportError
    ) {
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

  @Post('vue')
  buildVueExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildVueExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('svelte')
  buildSvelteExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildSvelteExport(composite);
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

  @Post('express')
  buildExpressExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildExpressExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('next')
  buildNextExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildNextExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('nuxt')
  buildNuxtExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildNuxtExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('mongodb')
  buildMongoExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildMongoExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('supabase')
  buildSupabaseExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildSupabaseExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('mysql')
  buildMysqlExport(@Body() composite: Composite) {
    try {
      return this.exportService.buildMysqlExport(composite);
    } catch (error) {
      this.handleExportError(error);
    }
  }

  @Post('bundle')
  buildBundleExport(@Body() body: Composite | ExportBundleRequest) {
    try {
      const { composite, stackProfile } = parseExportBundleBody(body);
      return this.exportService.buildBundleExport(composite, stackProfile);
    } catch (error) {
      this.handleExportError(error);
    }
  }
}

function parseExportBundleBody(body: Composite | ExportBundleRequest): {
  composite: Composite;
  stackProfile?: StackProfile;
} {
  if (body && typeof body === 'object' && 'composite' in body && body.composite) {
    return {
      composite: body.composite,
      stackProfile: body.stackProfile,
    };
  }

  return { composite: body as Composite };
}
