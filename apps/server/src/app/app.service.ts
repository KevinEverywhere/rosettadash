import { Injectable } from '@nestjs/common';
import { APP_NAME } from '@dashbuilder/core';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: `Welcome to ${APP_NAME} API` };
  }
}
