import { Controller, Get } from '@nestjs/common';
import { APP_NAME, APP_VERSION, createHealthResponse } from '@dashbuilder/core';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return createHealthResponse(APP_NAME, APP_VERSION);
  }
}
