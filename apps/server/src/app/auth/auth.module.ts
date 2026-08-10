import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { BuilderAuthGuard } from './builder-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BuilderAuthGuard,
    },
  ],
})
export class AuthModule {}
