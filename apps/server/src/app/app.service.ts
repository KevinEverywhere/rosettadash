import { Injectable } from '@nestjs/common';
import { APP_NAME } from '@rosettadash/core';

@Injectable()
export class AppService {
  getData(): { message: string; uiUrl: string } {
    return {
      message: `Welcome to ${APP_NAME} API. Open the builder UI to choose your stack and start designing.`,
      uiUrl: process.env['CLIENT_URL'] ?? 'http://localhost:4200',
    };
  }
}
