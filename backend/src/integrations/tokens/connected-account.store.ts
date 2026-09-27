import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppConfigService } from '../../config/app-config.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { IntegrationAccountContext } from '../contracts/integration-provider';
import {
  toPublicConnectedAccount,
  type PublicConnectedAccount,
} from '../public-connected-account';
import { decryptToken, encryptToken } from './token-cipher';

export interface SaveConnectedAccountInput {
  userId: string;
  provider: string;
  providerUserId: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
}

@Injectable()
export class ConnectedAccountStore {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
  ) {}

  async save(
    input: SaveConnectedAccountInput,
  ): Promise<PublicConnectedAccount> {
    const key = this.config.tokenEncryptionKey();
    const record = await this.prisma.connectedAccount.upsert({
      where: {
        userId_provider: { userId: input.userId, provider: input.provider },
      },
      create: {
        userId: input.userId,
        provider: input.provider,
        providerUserId: input.providerUserId,
        accessToken: encryptToken(input.accessToken, key),
        refreshToken: input.refreshToken
          ? encryptToken(input.refreshToken, key)
          : null,
        expiresAt: input.expiresAt,
      },
      update: {
        providerUserId: input.providerUserId,
        accessToken: encryptToken(input.accessToken, key),
        refreshToken: input.refreshToken
          ? encryptToken(input.refreshToken, key)
          : null,
        expiresAt: input.expiresAt,
      },
    });

    return toPublicConnectedAccount(record);
  }

  /**
   * Backend-only read path used when a provider syncs.
   * Controllers must not call this or return its result.
   */
  async readSecrets(
    userId: string,
    provider: string,
  ): Promise<IntegrationAccountContext | null> {
    const record = await this.prisma.connectedAccount.findUnique({
      where: { userId_provider: { userId, provider } },
    });
    if (!record) {
      return null;
    }

    try {
      const key = this.config.tokenEncryptionKey();
      return {
        userId: record.userId,
        provider: record.provider,
        providerUserId: record.providerUserId,
        accessToken: decryptToken(record.accessToken, key),
        refreshToken: record.refreshToken
          ? decryptToken(record.refreshToken, key)
          : null,
        expiresAt: record.expiresAt,
      };
    } catch {
      throw new InternalServerErrorException(
        'Не удалось прочитать сохранённые данные сервиса',
      );
    }
  }
}
