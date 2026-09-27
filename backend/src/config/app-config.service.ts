import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AppConfigService implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    this.databaseUrl();
    this.jwtSecret();
    this.tokenEncryptionKey();
  }

  port(): number {
    const port = Number(this.config.get<string>('PORT') ?? '4000');
    if (!Number.isInteger(port) || port <= 0) {
      throw new Error('PORT must be a positive integer');
    }
    return port;
  }

  nodeEnv(): string {
    return this.config.get<string>('NODE_ENV') ?? 'development';
  }

  frontendOrigin(): string {
    return (
      this.config.get<string>('FRONTEND_ORIGIN') ?? 'http://localhost:3000'
    );
  }

  databaseUrl(): string {
    return this.required('DATABASE_URL');
  }

  jwtSecret(): string {
    const secret = this.required('JWT_SECRET');
    if (secret.length < 16) {
      throw new Error('JWT_SECRET must be at least 16 characters');
    }
    return secret;
  }

  sessionMaxAgeMs(): number {
    return SESSION_MAX_AGE_MS;
  }

  tokenEncryptionKey(): string {
    const key = this.required('TOKEN_ENCRYPTION_KEY');
    const decoded = Buffer.from(key, 'base64');
    if (decoded.length !== 32) {
      throw new Error(
        'TOKEN_ENCRYPTION_KEY must be 32 bytes encoded as base64',
      );
    }
    return key;
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) {
      throw new Error(`${key} is not set`);
    }
    return value;
  }
}
