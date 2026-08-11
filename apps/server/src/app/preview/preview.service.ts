import { Injectable } from '@nestjs/common';
import {
  PreviewDataRequest,
  generatePreviewData,
} from '@rosettadash/ui-primitives';

@Injectable()
export class PreviewService {
  generateMockData(request: PreviewDataRequest) {
    return generatePreviewData(request);
  }
}
