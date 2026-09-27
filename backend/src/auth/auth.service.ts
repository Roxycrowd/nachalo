import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import type { CookieOptions } from 'express';
import { AppConfigService } from '../config/app-config.service';
import { UsersService } from '../users/users.service';
import type { SessionUser } from '../users/session-user';
import { SESSION_COOKIE } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { signSessionToken } from './session-token';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private dummyHash: Promise<string> | null = null;

  constructor(
    private readonly users: UsersService,
    private readonly config: AppConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<SessionUser> {
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    return this.users.create({
      email: dto.email,
      passwordHash,
      username: dto.username,
      name: dto.name,
    });
  }

  async login(dto: LoginDto): Promise<SessionUser> {
    const record = await this.users.getAuthRecordByEmail(dto.email);
    const passwordHash = record?.passwordHash ?? (await this.getDummyHash());
    const matches = await bcrypt.compare(dto.password, passwordHash);

    if (!record || !matches) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.users.getSession(record.userId);
  }

  signSession(userId: string): string {
    return signSessionToken(
      userId,
      this.config.jwtSecret(),
      this.config.sessionMaxAgeMs() / 1000,
    );
  }

  cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.nodeEnv() === 'production',
      path: '/',
      maxAge: this.config.sessionMaxAgeMs(),
    };
  }

  clearCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.nodeEnv() === 'production',
      path: '/',
    };
  }

  sessionCookieName(): string {
    return SESSION_COOKIE;
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= bcrypt.hash('vibe-timing-placeholder', BCRYPT_ROUNDS);
    return this.dummyHash;
  }
}
