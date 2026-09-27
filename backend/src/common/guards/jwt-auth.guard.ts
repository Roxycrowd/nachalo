import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SESSION_COOKIE } from '../../auth/auth.constants';
import { verifySessionToken } from '../../auth/session-token';
import { AppConfigService } from '../../config/app-config.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = readSessionCookie(request);
    if (!token) {
      throw new UnauthorizedException('Нужна авторизация');
    }

    try {
      const payload = verifySessionToken(token, this.config.jwtSecret());
      request.user = { id: payload.sub };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Нужна авторизация');
    }
  }
}

function readSessionCookie(request: Request): string | null {
  const cookies: unknown = request.cookies;
  if (!cookies || typeof cookies !== 'object') {
    return null;
  }
  const value = (cookies as Record<string, unknown>)[SESSION_COOKIE];
  return typeof value === 'string' && value.length > 0 ? value : null;
}
