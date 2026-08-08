import { Body, Controller, Post } from '@nestjs/common';
import type { PreviewDataRequest } from '@dashbuilder/ui-primitives';
import { PreviewService } from './preview.service';

@Controller('preview')
export class PreviewController {
  constructor(private readonly previewService: PreviewService) {}

  @Post('data')
  generateMockData(@Body() body: PreviewDataRequest = {}) {
    return this.previewService.generateMockData(body);
  }
}
