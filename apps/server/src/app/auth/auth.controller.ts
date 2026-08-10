import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { getBuilderApiKey, isBuilderAuthEnabled } from './builder-auth.config';

@Controller('auth')
export class AuthController {
  @Get('config')
  getConfig() {
    return { enabled: isBuilderAuthEnabled() };
  }

  @Post('login')
  login(@Body() body: { apiKey?: string }) {
    if (!isBuilderAuthEnabled()) {
      return { ok: true };
    }

    const configuredKey = getBuilderApiKey();
    if (!configuredKey || body.apiKey !== configuredKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return { ok: true };
  }
}
