import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  extractBuilderApiKey,
  getBuilderApiKey,
  isBuilderAuthEnabled,
  isPublicBuilderRoute,
} from './builder-auth.config';

@Injectable()
export class BuilderAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (!isBuilderAuthEnabled()) {
      return true;
    }

    const configuredKey = getBuilderApiKey();
    if (!configuredKey) {
      throw new UnauthorizedException(
        'Builder auth is enabled but BUILDER_API_KEY is not configured',
      );
    }

    const request = context.switchToHttp().getRequest<{ url?: string; path?: string }>();
    const routePath = request.path ?? request.url ?? '';
    if (isPublicBuilderRoute(routePath)) {
      return true;
    }

    const providedKey = extractBuilderApiKey(
      context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined> }>(),
    );
    if (providedKey === configuredKey) {
      return true;
    }

    throw new UnauthorizedException('Invalid or missing builder API key');
  }
}
