import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { Composite } from '@dashbuilder/core';
import {
  CompositeValidationError,
  CreateCompositeInput,
  CreateProjectInput,
  ProjectsService,
  UpdateProjectInput,
} from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  listProjects() {
    return this.projectsService.listProjects();
  }

  @Post()
  createProject(@Body() body: CreateProjectInput) {
    return this.projectsService.createProject(body);
  }

  @Get(':projectId')
  getProject(@Param('projectId') projectId: string) {
    return this.projectsService.getProject(projectId);
  }

  @Patch(':projectId')
  updateProject(
    @Param('projectId') projectId: string,
    @Body() body: UpdateProjectInput,
  ) {
    return this.projectsService.updateProject(projectId, body);
  }

  @Delete(':projectId')
  @HttpCode(204)
  deleteProject(@Param('projectId') projectId: string) {
    this.projectsService.deleteProject(projectId);
  }

  @Get(':projectId/composites')
  listComposites(@Param('projectId') projectId: string) {
    return this.projectsService.listComposites(projectId);
  }

  @Post(':projectId/composites')
  createComposite(
    @Param('projectId') projectId: string,
    @Body() body: CreateCompositeInput,
  ) {
    try {
      return this.projectsService.createComposite(projectId, body);
    } catch (error) {
      rethrowValidation(error);
    }
  }

  @Get(':projectId/composites/:compositeId/versions')
  listCompositeVersions(
    @Param('projectId') projectId: string,
    @Param('compositeId') compositeId: string,
  ) {
    return this.projectsService.listCompositeVersions(projectId, compositeId);
  }

  @Get(':projectId/composites/:compositeId/versions/:version')
  getCompositeVersion(
    @Param('projectId') projectId: string,
    @Param('compositeId') compositeId: string,
    @Param('version', ParseIntPipe) version: number,
  ) {
    return this.projectsService.getCompositeVersion(projectId, compositeId, version);
  }

  @Get(':projectId/composites/:compositeId/diff')
  diffCompositeVersions(
    @Param('projectId') projectId: string,
    @Param('compositeId') compositeId: string,
    @Query('from', ParseIntPipe) fromVersion: number,
    @Query('to', ParseIntPipe) toVersion: number,
  ) {
    if (fromVersion === toVersion) {
      throw new BadRequestException('Diff requires different from and to versions');
    }
    return this.projectsService.diffCompositeVersions(
      projectId,
      compositeId,
      fromVersion,
      toVersion,
    );
  }

  @Get(':projectId/composites/:compositeId')
  getComposite(
    @Param('projectId') projectId: string,
    @Param('compositeId') compositeId: string,
  ) {
    return this.projectsService.getComposite(projectId, compositeId);
  }

  @Put(':projectId/composites/:compositeId')
  updateComposite(
    @Param('projectId') projectId: string,
    @Param('compositeId') compositeId: string,
    @Body() body: Composite,
  ) {
    try {
      return this.projectsService.updateComposite(projectId, compositeId, body);
    } catch (error) {
      rethrowValidation(error);
    }
  }

  @Delete(':projectId/composites/:compositeId')
  @HttpCode(204)
  deleteComposite(
    @Param('projectId') projectId: string,
    @Param('compositeId') compositeId: string,
  ) {
    this.projectsService.deleteComposite(projectId, compositeId);
  }
}

function rethrowValidation(error: unknown): never {
  if (error instanceof CompositeValidationError) {
    throw new BadRequestException({
      message: 'Composite validation failed',
      issues: error.issues,
    });
  }
  throw error;
}
