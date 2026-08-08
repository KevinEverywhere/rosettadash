import { Injectable } from '@nestjs/common';
import {
  PreviewDataRequest,
  generatePreviewData,
} from '@dashbuilder/ui-primitives';

@Injectable()
export class PreviewService {
  generateMockData(request: PreviewDataRequest) {
    return generatePreviewData(request);
  }
}
